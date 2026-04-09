import prisma from '../utils/prisma';
import { ConflictError, NotFoundError, BadRequestError } from '../utils/customErrors';
import { ProductWhereInput, ProductOrderByInput } from '../types';
import { buildVariantSelectionMatrix } from './productVariant';

interface ProductFilters {
    search?: string;
    categoryId?: number;
    activeOnly?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
}

const parseExpirationDate = (value?: Date | string): Date | undefined => {
    if (!value) return undefined;
    if (value instanceof Date) {
        if (Number.isNaN(value.getTime())) {
            throw new BadRequestError('Son kullanma tarihi geçersiz');
        }
        return value;
    }

    const monthYearMatch = value.match(/^(0[1-9]|1[0-2])\/(\d{4})$/);
    if (monthYearMatch) {
        const month = Number(monthYearMatch[1]);
        const year = Number(monthYearMatch[2]);
        // Ay bazlı gelen tarihte ürünün ay sonunu saklıyoruz.
        return new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    }

    throw new BadRequestError('Son kullanma tarihi MM/YYYY formatında olmalıdır');
};

export const searchAndFilterProducts = async (filters: ProductFilters = {}) => {
    const where: ProductWhereInput = {};

    if (filters.search) {
        where.name = {
            contains: filters.search,
            mode: 'insensitive'
        }
    }

    if (filters.categoryId) {
        where.categoryId = filters.categoryId;
    }

    if (filters.activeOnly) {
        where.isActive = true;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.basePrice = {};

        if (filters.minPrice !== undefined) {
            where.basePrice.gte = filters.minPrice;
        }

        if (filters.maxPrice !== undefined) {
            where.basePrice.lte = filters.maxPrice;
        }
    }

    let orderBy: ProductOrderByInput = { createdAt: 'desc' };

    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'price_asc':
                orderBy = { basePrice: 'asc' };
                break;
            case 'price_desc':
                orderBy = { basePrice: 'desc' }
                break
            case 'name_asc':
                orderBy = { name: 'asc' }
                break;
            case 'name_desc':
                orderBy = { name: 'desc' }
                break;
            case 'newest':
                orderBy = { name: 'desc' }
                break;
            case 'oldest':
                orderBy = { createdAt: 'asc' }
                break;
        }
    }

    const products = await prisma.product.findMany({
        where,
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                }
            },
            photos: {
                where: { isPrimary: true },
                take: 1,
            },
            variants: {
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                    stockCount: true,
                    discount: true,
                    aroma: true,
                    size: true,
                    servings: true,
                }
            },
            comments: {
                where: {
                    isApproved: true,
                },
                select: {
                    id: true,
                },
            },
        },
        orderBy,
    });

    return products;
};

export const getPaginatedProducts = async (filters: ProductFilters, page: number = 1, limit: number = 12) => {
    const where: ProductWhereInput = {};

    if (filters.search) {
        where.name = {
            contains: filters.search,
            mode: 'insensitive'
        };
    }

    if (filters.activeOnly) {
        where.isActive = true;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.basePrice = {};

        if (filters.minPrice !== undefined) {
            where.basePrice.gte = filters.minPrice;
        }

        if (filters.maxPrice !== undefined) {
            where.basePrice.lte = filters.maxPrice;
        }
    }

    let orderBy: ProductOrderByInput = { createdAt: 'desc' };

    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'price_asc':
                orderBy = { basePrice: 'asc' };
                break;
            case 'price_desc':
                orderBy = { basePrice: 'desc' };
                break;
            case 'name_asc':
                orderBy = { name: 'asc' };
                break;
            case 'name_desc':
                orderBy = { name: 'desc' };
                break;
            case 'newest':
                orderBy = { createdAt: 'desc' };
                break;
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
        }
    }

    const totalProducts = await prisma.product.count({ where });

    const totalPages = Math.ceil(totalProducts / limit);
    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
        where,
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                }
            },
            photos: {
                where:
                    { isPrimary: true },
                take: 1,
            },
            variants: {
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                    stockCount: true,
                    discount: true,
                    aroma: true,
                    size: true,
                    servings: true,
                },
            },
            comments: {
                where: {
                    isApproved: true,
                },
                select: {
                    id: true,
                },
            },
        },
        orderBy,
        skip,
        take: limit,
    });

    return {
        products,
        pagination: {
            currentPage: page,
            totalPages,
            totalProducts,
            productsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        }
    };
}


export const getProductById = async (id: number) => {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            variants: {
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                    stockCount: true,
                    discount: true,
                    aroma: true,
                    size: true,
                    servings: true,
                }
            },
            photos: true,
        },
    });

    if (!product) {
        throw new NotFoundError('Ürün bulunamadı');
    }

    return product;
};

export const getProductBySlugService = async (slug: string) => {
    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: true,
            variants: {
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                    stockCount: true,
                    discount: true,
                    aroma: true,
                    size: true,
                    servings: true,
                }
            },
            photos: true,
            comments: {
                where: {
                    isApproved: true,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                }
            },
        },
    });

    if (!product) {
        throw new NotFoundError('Ürün bulunamadı');
    }

    return {
        ...product,
        variantSelection: buildVariantSelectionMatrix(product.variants),
    };
};

export const createProduct = async (data: {
    name: string;
    slug: string;
    description?: string;
    basePrice?: number;
    stockCount?: number;
    categoryId: number;
    isActive?: boolean;
    features?: string[];
    nutritionInfo?: string[];
    usage?: string[];
    expirationDate?: Date | string;
    taxRate?: number;
    servingSize?: string;
    ingredients?: string;
    nutritionValues?: any;
    aminoAcids?: any;
    variants?: Array<{
        name: string;
        sku: string;
        price: number;
        stockCount?: number;
        discount?: number;
        aroma?: string;
        size?: string;
        servings?: string;
    }>;
    photos?: Array<{
        url: string;
        altText?: string;
        isPrimary?: boolean;
        displayOrder?: number;
    }>;
}) => {
    const existingProduct = await prisma.product.findUnique({
        where: { slug: data.slug },
    });

    if (existingProduct) {
        throw new ConflictError('Bu slug zaten kullanılıyor');
    }

    const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
    });

    if (!category) {
        throw new NotFoundError('Kategori bulunamadı');
    }

    if (!category.isActive) {
        throw new BadRequestError('Pasif bir kategoriye ürün eklenemez');
    }

    const product = await prisma.product.create({
        data: {
            name: data.name,
            slug: data.slug,
            description: data.description,
            basePrice: data.basePrice,
            stockCount: data.stockCount ?? 0,
            categoryId: data.categoryId,
            isActive: data.isActive ?? true,
            features: data.features,
            nutritionInfo: data.nutritionInfo,
            usage: data.usage,
            expirationDate: parseExpirationDate(data.expirationDate),
            taxRate: data.taxRate ?? 20,
            servingSize: data.servingSize,
            ingredients: data.ingredients,
            nutritionValues: data.nutritionValues,
            aminoAcids: data.aminoAcids,
            variants: data.variants && data.variants.length > 0 ? {
                create: data.variants.map(v => ({
                    name: v.name,
                    sku: v.sku,
                    price: v.price,
                    stockCount: v.stockCount ?? 0,
                    discount: v.discount,
                    aroma: v.aroma,
                    size: v.size,
                    servings: v.servings,
                }))
            } : undefined,
            photos: data.photos && data.photos.length > 0 ? {
                create: data.photos.map((p, index) => ({
                    url: p.url,
                    altText: p.altText || data.name,
                    isPrimary: p.isPrimary ?? (index === 0),
                    displayOrder: p.displayOrder ?? index,
                }))
            } : undefined,
        },
        include: {
            category: true,
            variants: true,
            photos: true,
        },
    });

    return product;
};

export const updateProduct = async (
    id: number,
    data: {
        name?: string;
        slug?: string;
        description?: string;
        basePrice?: number;
        stockCount?: number;
        categoryId?: number;
        isActive?: boolean;
        features?: string[];
        nutritionInfo?: string[];
        usage?: string[];
        expirationDate?: Date | string;
        taxRate?: number;
        servingSize?: string;
        ingredients?: string;
        nutritionValues?: any;
        aminoAcids?: any;
        variants?: Array<{
            name: string;
            sku: string;
            price: number;
            stockCount?: number;
            discount?: number;
            aroma?: string;
            size?: string;
            servings?: string;
        }>;
        photos?: Array<{
            url: string;
            altText?: string;
            isPrimary?: boolean;
            displayOrder?: number;
        }>;
    }
) => {
    await getProductById(id);

    if (data.slug) {
        const existingProduct = await prisma.product.findUnique({
            where: { slug: data.slug },
        });

        if (existingProduct && existingProduct.id !== id) {
            throw new ConflictError('Bu slug zaten başka bir üründe kullanılıyor');
        }
    }

    if (data.categoryId) {
        const category = await prisma.category.findUnique({
            where: { id: data.categoryId },
        });

        if (!category) {
            throw new NotFoundError('Kategori bulunamadı');
        }

        if (!category.isActive) {
            throw new BadRequestError('Pasif bir kategoriye ürün taşınamaz');
        }
    }

    const { variants, photos, ...productData } = data;

    const updateData = {
        ...productData,
        expirationDate: parseExpirationDate(productData.expirationDate),
    };

    if (variants && variants.length > 0) {
        await prisma.productVariant.deleteMany({
            where: { productId: id },
        });

        await prisma.productVariant.createMany({
            data: variants.map(v => ({
                productId: id,
                name: v.name,
                sku: v.sku,
                price: v.price,
                stockCount: v.stockCount ?? 0,
                discount: v.discount,
                aroma: v.aroma,
                size: v.size,
                servings: v.servings,
            })),
        });
    }

    if (photos && photos.length > 0) {
        await prisma.productPhoto.deleteMany({
            where: { productId: id },
        });

        await prisma.productPhoto.createMany({
            data: photos.map((p, index) => ({
                productId: id,
                url: p.url,
                altText: p.altText || '',
                isPrimary: p.isPrimary ?? (index === 0),
                displayOrder: p.displayOrder ?? index,
            })),
        });
    }

    const product = await prisma.product.update({
        where: { id },
        data: updateData,
        include: {
            category: true,
            variants: true,
            photos: true,
        },
    });

    return product;
};

export const deleteProduct = async (id: number) => {
    await getProductById(id);
    return prisma.product.delete({
        where: { id },
    });
};