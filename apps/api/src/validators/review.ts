import { z } from 'zod';

export const createReviewSchema = z.object({
    productId: z
        .number({ message: 'Ürün ID gerekli' })
        .int({ message: 'Ürün ID tam sayı olmalı' })
        .positive({ message: 'Ürün ID pozitif olmalı' }),

    orderId: z
        .number({ message: 'Sipariş ID gerekli' })
        .int({ message: 'Sipariş ID tam sayı olmalı' })
        .positive({ message: 'Sipariş ID pozitif olmalı' }),

    orderItemId: z
        .number({ message: 'Sipariş ürün ID gerekli' })
        .int({ message: 'Sipariş ürün ID tam sayı olmalı' })
        .positive({ message: 'Sipariş ürün ID pozitif olmalı' }),

    rating: z
        .number({ message: 'Puan gerekli' })
        .int({ message: 'Puan tam sayı olmalı' })
        .min(1, 'Puan en az 1 olmalı')
        .max(5, 'Puan en fazla 5 olmalı'),

    comment: z
        .string({ message: 'Yorum gerekli' })
        .min(10, 'Yorum en az 10 karakter olmalı')
        .max(500, 'Yorum en fazla 500 karakter olmalı')
});
