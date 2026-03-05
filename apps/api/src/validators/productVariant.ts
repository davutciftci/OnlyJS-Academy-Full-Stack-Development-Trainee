import { z } from 'zod';

export const createVariantSchema = z.object({
    name: z
        .string({ message: 'Varyant adı gerekli' })
        .min(2, 'Varyant adı en az 2 karakter olmalı')
        .max(200, 'Varyant adı en fazla 200 karakter olmalı'),

    sku: z
        .string({ message: 'SKU gerekli' })
        .min(3, 'SKU en az 3 karakter olmalı')
        .max(100, 'SKU en fazla 100 karakter olmalı')
        .regex(/^[A-Z0-9-]+$/, 'SKU sadece büyük harf, rakam ve tire içerebilir'),

    price: z
        .number({ message: 'Fiyat gerekli' })
        .positive('Fiyat 0\'dan büyük olmalı')
        .max(999999.99, 'Fiyat çok yüksek'),

    stockCount: z
        .number({ message: 'Stok gerekli' })
        .int('Stok tam sayı olmalı')
        .nonnegative('Stok negatif olamaz')
        .optional()
        .default(0),

    productId: z
        .number({ message: 'Ürün ID gerekli' })
        .int('Ürün ID tam sayı olmalı')
        .positive('Geçersiz ürün ID'),

    attributes: z
        .record(z.string(), z.any())
        .optional(),

    isActive: z
        .boolean({ message: 'Aktiflik durumu gerekli' })
        .optional()
        .default(true),
});


export const updateVariantSchema = createVariantSchema.partial();