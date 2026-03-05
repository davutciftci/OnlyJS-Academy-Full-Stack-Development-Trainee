import prisma from "../utils/prisma"
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ConflictError, UnauthorizedError } from "../utils/customErrors";
import { sendWelcomeEmail, sendPasswordResetEmail } from "./mail";

export const createUser = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthDay: Date;
}) => {

    const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
    });

    if (existingUser) {
        throw new ConflictError('Bu email zaten kullanılıyor');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
        data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            hashedPassword,
            birthDay: userData.birthDay
        }
    })

    sendWelcomeEmail(user.email, user.firstName).catch(err => console.error(err));

    return user;
}

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new UnauthorizedError('Email veya şifre hatalı');
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
        throw new UnauthorizedError('Email veya şifre hatalı');
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    )

    const { hashedPassword, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
}

export const requestPasswordReset = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetToken,
            resetTokenExpiry
        }
    });

    await sendPasswordResetEmail(user.email, user.firstName, resetToken);
}

export const resetPassword = async (token: string, newPassword: string) => {
    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: {
                gt: new Date()
            }
        }
    });

    if (!user) {
        throw new UnauthorizedError('Geçersiz veya süresi dolmuş token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        }
    });

    return { message: 'Şifreniz başarıyla güncellendi' };
}
