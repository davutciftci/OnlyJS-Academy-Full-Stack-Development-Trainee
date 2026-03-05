import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string({ message: 'Kategori gerekli' })
        .min(3, 'Kategori adı en az 3 karekter olamlı')
        .max(100, 'Kategori adı en fazla 100 karakter olmalı'),

    description: z.string()
        .max(255, 'Açıklama en fazla 255 karakter olmalı')
        .optional(),

    slug: z
        .string({ message: "Slug gerekli" })
        .min(2, 'slug en az 2 karakter olmalı')
        .max(100, 'Slug en falz 100 karakter olmalı')
        .regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve kısa çizgi içerebilir'),

    isActive: z
        .boolean()
        .optional()
        .default(true)
})

export const updateCategorySchema = createCategorySchema.partial();