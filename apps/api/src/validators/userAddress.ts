import { z } from 'zod';

export const createAddressSchema = z.object({
    title: z
        .string({ message: 'Adres başlığı gerekli' })
        .min(2, 'Adres başlığı en az 2 karakter olmalı')
        .max(50, 'Adres başlığı en fazla 50 karakter olmalı'),

    fullName: z
        .string({ message: 'Ad Soyad gerekli' })
        .min(3, 'Ad Soyad en az 3 karakter olmalı')
        .max(100, 'Ad Soyad en fazla 100 karakter olmalı'),

    phoneNumber: z
        .string({ message: 'Telefon numarası gerekli' })
        .min(10, 'Telefon numarası en az 10 karakter olmalı')
        .max(14, 'Telefon numarası en fazla 14 karakter olmalı'),

    addressLine1: z
        .string({ message: 'Adres satırı gerekli' })
        .min(10, 'Adres en az 10 karakter olmalı')
        .max(500, 'Adres en fazla 500 karakter olmalı'),

    city: z
        .string({ message: 'Şehir gerekli' })
        .min(2, 'Şehir en az 2 karakter olmalı')
        .max(50, 'Şehir en fazla 50 karakter olmalı'),

    district: z
        .string({ message: 'İlçe gerekli' })
        .min(2, 'İlçe en az 2 karakter olmalı')
        .max(50, 'İlçe en fazla 50 karakter olmalı'),

    postalCode: z
        .string()
        .min(5, 'Posta kodu en az 5 karakter olmalı')
        .max(10, 'Posta kodu en fazla 10 karakter olmalı')
        .optional()
        .or(z.literal('')),

    isDefault: z
        .boolean()
        .optional()
        .default(false),
});

export const updateAddressSchema = createAddressSchema.partial();