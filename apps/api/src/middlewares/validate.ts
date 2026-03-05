import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../utils/customErrors';

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'issues' in error) {
                const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
                const errors = zodError.issues?.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                next(new ValidationError('Bilgileri eksiksiz doldurunuz.', errors));
            } else {
                next(error);
            }
        }
    };
};