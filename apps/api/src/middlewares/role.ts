import { Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/customErrors';
import { UserRole } from '../../generated/prisma';
import { AuthenticatedRequest } from './auth';

export const requireRole = (...allowedRoles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userRole = req.user?.role;

            if (!userRole) {
                throw new UnauthorizedError('Kullanıcı rolü bulunamadı')
            }

            if (!allowedRoles.includes(userRole)) {
                throw new UnauthorizedError('Bu işlem için yetkiniz yok')
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}