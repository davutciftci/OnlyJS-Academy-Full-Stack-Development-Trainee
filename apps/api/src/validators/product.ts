import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string({ message: "Ürün adı zorunludur" })
        .min(2, "Ürün adı en az 2 karakter olmalıdır")
        .max(200, "Ürün adı en fazla 200 karakter olmalıdır"),

    slug: z.string({ message: "Slug zorunludur" })
        .min(2, "Slug en az 2 karakter olmalıdır")
        .max(200, "Slug en fazla 200 karakter olmalıdır")
        .regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve kısa çizgi içerebilir"),

    description: z.string()
        .max(1000, "Açıklama en fazla 1000 karakter olmalıdır")
        .optional(),

    basePrice: z.number({ message: "Taban fiyat geçerli bir sayı olmalıdır" })
        .positive("Taban fiyat 0'dan büyük olmalıdır")
        .max(999999.99, "Taban fiyat çok yüksek")
        .optional(),

    stockCount: z.number({ message: "Stok miktarı geçerli bir sayı olmalıdır" })
        .int("Stok miktarı tam sayı olmalıdır")
        .nonnegative("Stok miktarı 0 veya daha büyük olmalıdır")
        .optional()
        .default(0),

    categoryId: z.number({ message: "Kategori seçilmelidir" })
        .int("Kategori ID tam sayı olmalıdır")
        .positive("Geçerli bir kategori seçilmelidir"),

    isActive: z.boolean()
        .optional()
        .default(true),

    features: z.array(z.string(), { message: "Özellikler geçerli bir liste olmalıdır" })
        .optional(),

    usage: z.array(z.string(), { message: "Kullanım şekli geçerli bir liste olmalıdır" })
        .optional(),

    expirationDate: z.string({ message: "Son kullanma tarihi geçerli bir tarih olmalıdır" })
        .optional()
        .transform((val) => val ? new Date(val) : undefined),

    taxRate: z.number({ message: "KDV oranı geçerli bir sayı olmalıdır" })
        .min(0, "KDV oranı 0 veya daha büyük olmalıdır")
        .max(100, "KDV oranı 100'den küçük veya eşit olmalıdır")
        .optional()
        .default(20),

    servingSize: z.string({ message: "Servis boyutu geçerli bir metin olmalıdır" })
        .optional(),

    ingredients: z.string({ message: "İçindekiler geçerli bir metin olmalıdır" })
        .optional(),

    nutritionValues: z.any()
        .optional(),

    aminoAcids: z.any()
        .optional(),
})

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
    categoryId: z.string()
        .transform((val) => parseInt(val))
        .pipe(z.number().int().positive())
        .optional(),

    activeOnly: z.string()
        .transform((val) => val === "true")
        .optional(),

    minPrice: z.string()
        .transform((val) => parseFloat(val))
        .pipe(z.number().nonnegative())
        .optional(),

    maxPrice: z.string()
        .transform((val) => parseFloat(val))
        .pipe(z.number().positive())
        .optional(),
})
