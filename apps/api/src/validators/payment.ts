import { z } from 'zod';

export const processPaymentSchema = z.object({
    orderId: z
        .number({ message: 'Sipariş ID gerekli' })
        .int('Sipariş ID tam sayı olmalı')
        .positive('Geçersiz sipariş ID'),

    cardDetails: z.object({
        cardHolderName: z
            .string({ message: 'Kart sahibi adı gerekli' })
            .min(3, 'Kart sahibi adı en az 3 karakter olmalı')
            .max(100, 'Kart sahibi adı en fazla 100 karakter olmalı'),

        cardNumber: z
            .string({ message: 'Kart numarası gerekli' })
            .regex(/^[0-9]{16}$/, 'Kart numarası 16 haneli olmalı'),

        expireMonth: z
            .string({ message: 'Son kullanma ayı gerekli' })
            .regex(/^(0[1-9]|1[0-2])$/, 'Geçerli bir ay girin (01-12)'),

        expireYear: z
            .string({ message: 'Son kullanma yılı gerekli' })
            .regex(/^20[2-9][0-9]$/, 'Geçerli bir yıl girin (2020-2099)'),

        cvc: z
            .string({ message: 'CVC gerekli' })
            .regex(/^[0-9]{3}$/, 'CVC 3 haneli olmalı'),
    }),
});