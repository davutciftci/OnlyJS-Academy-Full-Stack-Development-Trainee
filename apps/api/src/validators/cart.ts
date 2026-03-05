import { z } from 'zod';

export const addToCartSchema = z.object({
    variantId: z
        .number({ message: 'Varyant ID gerekli' })
        .int('Varyant ID tam sayı olmalı')
        .positive('Geçersiz varyant ID'),

    quantity: z
        .number({ message: 'Miktar gerekli' })
        .int('Miktar tam sayı olmalı')
        .min(1, 'Miktar en az 1 olmalı')
        .max(100, 'Miktar en fazla 100 olabilir'),
});


export const updateCartItemSchema = z.object({
    quantity: z
        .number({ message: 'Miktar gerekli' })
        .int('Miktar tam sayı olmalı')
        .min(1, 'Miktar en az 1 olmalı')
        .max(100, 'Miktar en fazla 100 olabilir'),
});