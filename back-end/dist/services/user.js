"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.loginUser = exports.createUser = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const customErrors_1 = require("../utils/customErrors");
const mail_1 = require("./mail");
const createUser = async (userData) => {
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email: userData.email }
    });
    if (existingUser) {
        throw new customErrors_1.ConflictError('Bu email zaten kullanılıyor');
    }
    const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
    const user = await prisma_1.default.user.create({
        data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            hashedPassword,
            birthDay: userData.birthDay
        }
    });
    (0, mail_1.sendWelcomeEmail)(user.email, user.firstName).catch(err => console.error(err));
    return user;
};
exports.createUser = createUser;
const loginUser = async (email, password) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new customErrors_1.UnauthorizedError('Email veya şifre hatalı');
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
        throw new customErrors_1.UnauthorizedError('Email veya şifre hatalı');
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const { hashedPassword, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};
exports.loginUser = loginUser;
const requestPasswordReset = async (email) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email }
    });
    if (!user) {
        return;
    }
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);
    await prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            resetToken,
            resetTokenExpiry
        }
    });
    await (0, mail_1.sendPasswordResetEmail)(user.email, user.firstName, resetToken);
};
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = async (token, newPassword) => {
    const user = await prisma_1.default.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: {
                gt: new Date()
            }
        }
    });
    if (!user) {
        throw new customErrors_1.UnauthorizedError('Geçersiz veya süresi dolmuş token');
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    await prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        }
    });
    return { message: 'Şifreniz başarıyla güncellendi' };
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=user.js.map