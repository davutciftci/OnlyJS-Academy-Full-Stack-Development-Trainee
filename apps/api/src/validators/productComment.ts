import { z } from 'zod';

export const createCommentSchema = z.object({
    title: z
        .string({ message: 'Başlık gerekli' })
        .min(3, 'Başlık en az 3 karakter olmalı')
        .max(100, 'Başlık en fazla 100 karakter olmalı'),

    rating: z
        .number({ message: 'Puan gerekli' })
        .int('Puan tam sayı olmalı')
        .min(1, 'Puan en az 1 olmalı')
        .max(5, 'Puan en fazla 5 olmalı'),

    comment: z
        .string({ message: 'Yorum gerekli' })
        .min(5, 'Yorum en az 5 karakter olmalı')
        .max(1000, 'Yorum en fazla 1000 karakter olmalı'),

    productId: z
        .number({ message: 'Ürün ID gerekli' })
        .int('Ürün ID tam sayı olmalı')
        .positive('Geçersiz ürün ID'),
});

export const updateCommentSchema = z.object({
    title: z
        .string({ message: 'Başlık gerekli' })
        .min(3, 'Başlık en az 3 karakter olmalı')
        .max(100, 'Başlık en fazla 100 karakter olmalı')
        .optional(),

    rating: z
        .number()
        .int('Puan tam sayı olmalı')
        .min(1, 'Puan en az 1 olmalı')
        .max(5, 'Puan en fazla 5 olmalı')
        .optional(),

    comment: z
        .string()
        .min(5, 'Yorum en az 5 karakter olmalı')
        .max(1000, 'Yorum en fazla 1000 karakter olmalı')
        .optional(),
});


export const approveCommentSchema = z.object({
    isApproved: z
        .boolean({ message: 'Onay durumu gerekli' }),
});