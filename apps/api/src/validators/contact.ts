import { z } from 'zod';

export const contactSchema = z.object({
    firstName: z
        .string({ message: 'İsim gerekli' })
        .min(2, 'İsim en az 2 karakter olmalı')
        .max(50, 'İsim en fazla 50 karakter olmalı'),

    lastName: z
        .string({ message: 'Soyisim gerekli' })
        .min(2, 'Soyisim en az 2 karakter olmalı')
        .max(50, 'Soyisim en fazla 50 karakter olmalı'),

    email: z
        .string({ message: 'Email gerekli' })
        .email('Geçerli bir email adresi girin'),

    message: z
        .string({ message: 'Mesaj gerekli' })
        .min(5, 'Mesaj en az 5 karakter olmalı')
        .max(1000, 'Mesaj en fazla 1000 karakter olmalı')
});
