import { Prisma } from '../../generated/prisma';
import { AppError, ValidationError } from '../utils/customErrors';
import { Request, Response, NextFunction } from 'express';


export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (process.env.NODE_ENV === 'production') {
        console.error('Error:', {
            message: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString(),
            path: req.path,
            method: req.method
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: 'error',
            message: 'Geçersiz token',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            message: 'Token süresi dolmuş',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            errors: err.errors,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    if (err.name === 'MulterError') {
        if (err.message.includes('File too large')) {
            return res.status(400).json({
                status: 'error',
                message: 'Dosya boyutu çok büyük (maksimum 5MB)',
                ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
            });
        }
        if (err.message.includes('Unexpected field')) {
            return res.status(400).json({
                status: 'error',
                message: 'Beklenmeyen dosya alanı',
                ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
            });
        }
        return res.status(400).json({
            status: 'error',
            message: `Dosya yükleme hatası: ${err.message}`,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    if (err.constructor.name === 'PrismaClientInitializationError') {
        console.error('[DB INIT ERROR]', err.message);
        return res.status(503).json({
            status: 'error',
            message: 'Veritabanı bağlantı hatası',
            details: err.message
        });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('[PRISMA ERROR] code:', err.code, '| meta:', JSON.stringify(err.meta), '| msg:', err.message);

        if (err.code === 'P2002') {
            const field = (err.meta?.target as string[])?.[0] || 'alan';
            return res.status(409).json({
                status: 'error',
                message: `Bu ${field} zaten kullanılıyor`,
            });
        }

        if (err.code === 'P2025') {
            return res.status(404).json({
                status: 'error',
                message: 'Kayıt bulunamadı',
            });
        }

        if (err.code === 'P2003') {
            return res.status(400).json({
                status: 'error',
                message: 'İlişkili kayıt bulunamadı',
            });
        }

        return res.status(400).json({
            status: 'error',
            message: 'Veritabanı işlemi başarısız',
            code: err.code,
            meta: err.meta
        });
    }

    // Catch-all — tam hata mesajını logla
    console.error('[UNHANDLED ERROR]', err.constructor.name, err.message);
    return res.status(500).json({
        status: 'error',
        message: err.message,
        type: err.constructor.name
    });
};