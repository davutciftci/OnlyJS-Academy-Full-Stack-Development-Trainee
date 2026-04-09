import { Router } from "express";
import { getProfile, login, register, updateProfile, requestPasswordResetController, resetPasswordController, changePassword, verifyEmail, resendVerification } from "../controllers/user";
import { authenticate, AuthenticatedRequest } from "../middlewares/auth";
import { loginSchema, registerSchema, requestPasswordResetSchema, resetPasswordSchema, updateProfileSchema, changePasswordSchema } from "../validators/user";
import { validate } from "../middlewares/validate";
import { UserRole } from '../../generated/prisma';
import { requireRole } from "../middlewares/role";
import { authLimiter, authSensitiveLimiter } from "../middlewares/rateLimiter";

import { validateTurnstile } from "../middlewares/turnstile";

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), validateTurnstile, register);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Log in to the application
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       403:
 *         description: Email not verified
 *       401:
 *         description: Unauthorized
 */
router.post('/login', authLimiter, validate(loginSchema), validateTurnstile, login);
router.post('/verify-email', authSensitiveLimiter, verifyEmail);
router.post('/resend-verification', authSensitiveLimiter, resendVerification);
router.post('/forgot-password', authSensitiveLimiter, validate(requestPasswordResetSchema), validateTurnstile, requestPasswordResetController);
router.post('/reset-password', authSensitiveLimiter, validate(resetPasswordSchema), resetPasswordController);

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticate, getProfile);
router.get('/me', authenticate, getProfile);
router.patch('/profile', authenticate, validate(updateProfileSchema), updateProfile);
router.post('/change-password', authenticate, validate(changePasswordSchema), changePassword);
router.get('/admin-only', authenticate, requireRole(UserRole.ADMIN), (req, res) => {
    res.json({
        status: 'success',
        user: (req as AuthenticatedRequest).user
    })
})

export default router;