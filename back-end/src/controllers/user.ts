import { NextFunction, Request, Response } from 'express';
import { createUser, loginUser, requestPasswordReset as requestPasswordResetService, resetPassword as resetPasswordService } from '../services/user';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';
import { NotFoundError } from '../utils/customErrors';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../services/mail';

interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birth_date: string;
}

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, birth_date } = req.body as RegisterRequest;
    
    // 6 haneli doğrulama kodu üret
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 dakika

    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            hashedPassword: await require('bcrypt').hash(password, 10),
            birthDay: new Date(birth_date),
            verificationCode,
            verificationCodeExpires,
            isVerified: false
        }
    });

    // Doğrulama maili gönder (prtinnn@gmail.com'a gidecek şekilde ayarlandı)
    await sendVerificationEmail(email, firstName, verificationCode);

    const { hashedPassword, verificationCode: vc, ...userWithoutSensitiveData } = user;

    return res.status(201).json({
        status: "success",
        message: 'Kullanıcı başarıyla oluşturuldu. Lütfen e-posta adresinize gönderilen kodu doğrulayın.',
        data: { 
            user: userWithoutSensitiveData
        }
    });
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const { user, token } = await loginUser(email, password);

    // E-posta doğrulaması yapılmamışsa giriş engellenir
    if (!user.isVerified) {
        return res.status(403).json({
            status: 'error',
            code: 'EMAIL_NOT_VERIFIED',
            message: 'E-posta adresiniz henüz doğrulanmamış. Lütfen doğrulama adımını tamamlayın.',
            data: { email: user.email }
        });
    }

    return res.status(200).json({
        status: 'success',
        message: 'Giriş yapıldı',
        data: { user, token },
    });
});

export const getProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId) {
        throw new NotFoundError('Kullanıcı bulunamadı');
    }
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            birthDay: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    if (!user) {
        throw new NotFoundError('Kullanıcı bulunamadı');
    }

    return res.status(200).json({
        status: 'success',
        data: user,
    });

});

export const requestPasswordResetController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    await requestPasswordResetService(email);

    return res.status(200).json({
        status: 'success',
        message: 'Eğer bu email adresi sistemde kayıtlıysa, şifre sıfırlama linki gönderilecektir.'
    });
});

export const resetPasswordController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { token, newPassword } = req.body;

    await resetPasswordService(token, newPassword);

    return res.status(200).json({
        status: 'success',
        message: 'Şifreniz başarıyla güncellendi'
    });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const { firstName, lastName, phoneNumber } = req.body;

    if (!userId) {
        throw new NotFoundError('Kullanıcı bulunamadı');
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(phoneNumber !== undefined && { phoneNumber }),
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            birthDay: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    return res.status(200).json({
        status: 'success',
        message: 'Profil başarıyla güncellendi',
        data: updatedUser,
    });
});

export const changePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
        throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new NotFoundError('Kullanıcı bulunamadı');
    }

    // Mevcut şifreyi doğrula
    const bcrypt = require('bcrypt');
    const isPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword);

    if (!isPasswordValid) {
        return res.status(400).json({
            status: 'error',
            message: 'Mevcut şifre hatalı'
        });
    }

    // Yeni şifreyi hashle
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Şifreyi güncelle
    await prisma.user.update({
        where: { id: userId },
        data: { hashedPassword }
    });

    return res.status(200).json({
        status: 'success',
        message: 'Şifreniz başarıyla güncellendi'
    });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { email, code } = req.body;

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new NotFoundError('Kullanıcı bulunamadı');
    }

    if (user.isVerified) {
        return res.status(400).json({
            status: 'error',
            message: 'E-posta adresi zaten doğrulanmış'
        });
    }

    if (user.verificationCode !== code) {
        return res.status(400).json({
            status: 'error',
            message: 'Geçersiz doğrulama kodu'
        });
    }

    if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
        return res.status(400).json({
            status: 'error',
            message: 'Doğrulama kodunun süresi dolmuş'
        });
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            verificationCode: null,
            verificationCodeExpires: null
        }
    });

    // Doğrulama sonrası otomatik login için token oluştur
    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    );

    return res.status(200).json({
        status: 'success',
        message: 'E-posta adresiniz başarıyla doğrulandı',
        data: { 
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            },
            token 
        }
    });
});

export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new NotFoundError('Kullanıcı bulunamadı');
    }

    if (user.isVerified) {
        return res.status(400).json({
            status: 'error',
            message: 'E-posta adresi zaten doğrulanmış'
        });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            verificationCode,
            verificationCodeExpires
        }
    });

    await sendVerificationEmail(email, user.firstName, verificationCode);

    return res.status(200).json({
        status: 'success',
        message: 'Yeni doğrulama kodu gönderildi'
    });
});

