import { z } from 'zod';

export const createPhotoSchema = z.object({
    url: z
        .string({ message: 'Fotoğraf URL\'i gerekli' })
        .url('Geçerli bir URL giriniz')
        .max(500, 'URL çok uzun'),

    altText: z
        .string()
        .max(200, 'Alt text en fazla 200 karakter olmalı')
        .optional(),

    isPrimary: z
        .boolean()
        .optional()
        .default(false),

    displayOrder: z
        .number()
        .int('Display order tam sayı olmalı')
        .nonnegative('Display order negatif olamaz')
        .optional()
        .default(0),

    productId: z
        .number({ message: 'Ürün ID gerekli' })
        .int('Ürün ID tam sayı olmalı')
        .positive('Geçersiz ürün ID'),
});


export const updatePhotoSchema = z.object({
    url: z
        .string()
        .url('Geçerli bir URL giriniz')
        .max(500, 'URL çok uzun')
        .optional(),

    altText: z
        .string()
        .max(200, 'Alt text en fazla 200 karakter olmalı')
        .optional(),

    isPrimary: z
        .boolean()
        .optional(),

    displayOrder: z
        .number()
        .int('Display order tam sayı olmalı')
        .nonnegative('Display order negatif olamaz')
        .optional(),
});


export const uploadPhotoSchema = z.object({
    productId: z
        .string({ message: 'Ürün ID gerekli' })
        .transform((val) => parseInt(val))
        .pipe(z.number().int().positive()),

    altText: z
        .string()
        .max(200, 'Alt text en fazla 200 karakter olmalı')
        .optional(),

    isPrimary: z
        .string()
        .optional()
        .default('false'),

    displayOrder: z
        .string()
        .optional()
        .default('0'),
});