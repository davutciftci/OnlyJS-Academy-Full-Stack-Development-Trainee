import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/customErrors';
import { asyncHandler } from '../utils/asyncHandler';
import { UserRole } from '../../generated/prisma';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        email: string;
        role: UserRole;
    };
}

export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            throw new UnauthorizedError('Token bulunamadı');
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: number;
            email: string;
            role: UserRole;
        }

        (req as AuthenticatedRequest).user = decoded;
        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new UnauthorizedError('Geçersiz token'));
        }
        if (error instanceof jwt.TokenExpiredError) {
            return next(new UnauthorizedError('Token süresi dolmuş'));
        }
        next(error);
    }
})