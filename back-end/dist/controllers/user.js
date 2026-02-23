"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerification = exports.verifyEmail = exports.changePassword = exports.updateProfile = exports.resetPasswordController = exports.requestPasswordResetController = exports.getProfile = exports.login = exports.register = void 0;
const user_1 = require("../services/user");
const asyncHandler_1 = require("../utils/asyncHandler");
const prisma_1 = __importDefault(require("../utils/prisma"));
const customErrors_1 = require("../utils/customErrors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_1 = require("../services/mail");
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { firstName, lastName, email, password, birth_date } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    const user = await prisma_1.default.user.create({
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
    await (0, mail_1.sendVerificationEmail)(email, firstName, verificationCode);
    const { hashedPassword, verificationCode: vc, ...userWithoutSensitiveData } = user;
    return res.status(201).json({
        status: "success",
        message: 'Kullanıcı başarıyla oluşturuldu. Lütfen e-posta adresinize gönderilen kodu doğrulayın.',
        data: {
            user: userWithoutSensitiveData
        }
    });
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { email, password } = req.body;
    const { user, token } = await (0, user_1.loginUser)(email, password);
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
exports.getProfile = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new customErrors_1.NotFoundError('Kullanıcı bulunamadı');
    }
    const user = await prisma_1.default.user.findUnique({
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
        throw new customErrors_1.NotFoundError('Kullanıcı bulunamadı');
    }
    return res.status(200).json({
        status: 'success',
        data: user,
    });
});
exports.requestPasswordResetController = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { email } = req.body;
    await (0, user_1.requestPasswordReset)(email);
    return res.status(200).json({
        status: 'success',
        message: 'Eğer bu email adresi sistemde kayıtlıysa, şifre sıfırlama linki gönderilecektir.'
    });
});
exports.resetPasswordController = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { token, newPassword } = req.body;
    await (0, user_1.resetPassword)(token, newPassword);
    return res.status(200).json({
        status: 'success',
        message: 'Şifreniz başarıyla güncellendi'
    });
});
exports.updateProfile = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const userId = req.user?.userId;
    const { firstName, lastName, phoneNumber } = req.body;
    if (!userId) {
        throw new customErrors_1.NotFoundError('Kullanıcı bulunamadı');
    }
    const updatedUser = await prisma_1.default.user.update({
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
exports.changePassword = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;
    if (!userId) {
        throw new customErrors_1.NotFoundError('Kullanıcı bulunamadı');
    }
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId }
    });
    if (!user) {
        throw new customErrors_1.NotFoundError('Kullanıcı bulunamadı');
    }
    const bcrypt = require('bcrypt');
    const isPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isPasswordValid) {
        return res.status(400).json({
            status: 'error',
            message: 'Mevcut şifre hatalı'
        });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma_1.default.user.update({
        where: { id: userId },
        data: { hashedPassword }
    });
    return res.status(200).json({
        status: 'success',
        message: 'Şifreniz başarıyla güncellendi'
    });
});
exports.verifyEmail = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, code } = req.body;
    const user = await prisma_1.default.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new customErrors_1.NotFoundError('Kullanıcı bulunamadı');
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
    await prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            verificationCode: null,
            verificationCodeExpires: null
        }
    });
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
exports.resendVerification = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    const user = await prisma_1.default.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new customErrors_1.NotFoundError('Kullanıcı bulunamadı');
    }
    if (user.isVerified) {
        return res.status(400).json({
            status: 'error',
            message: 'E-posta adresi zaten doğrulanmış'
        });
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    await prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            verificationCode,
            verificationCodeExpires
        }
    });
    await (0, mail_1.sendVerificationEmail)(email, user.firstName, verificationCode);
    return res.status(200).json({
        status: 'success',
        message: 'Yeni doğrulama kodu gönderildi'
    });
});
//# sourceMappingURL=user.js.map