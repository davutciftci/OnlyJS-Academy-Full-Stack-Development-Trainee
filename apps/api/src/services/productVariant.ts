import prisma from '../utils/prisma';
import { ConflictError, NotFoundError, BadRequestError } from '../utils/customErrors';

/** Slug/detay API’sinde aroma–boyut seçeneklerini istemciye net vermek için (cartesian hayali kombinasyonları önler). */
export type VariantMatrixInput = {
    id: number;
    aroma: string | null;
    size: string | null;
};

export type VariantSelectionMatrix = {
    sizesByAroma: Record<string, string[]>;
    aromasBySize: Record<string, string[]>;
};

export function buildVariantSelectionMatrix(variants: VariantMatrixInput[]): VariantSelectionMatrix {
    const sizesByAroma: Record<string, Set<string>> = {};
    const aromasBySize: Record<string, Set<string>> = {};

    for (const v of variants) {
        if (v.aroma == null || v.size == null || v.aroma === '' || v.size === '') continue;
        if (!sizesByAroma[v.aroma]) sizesByAroma[v.aroma] = new Set();
        sizesByAroma[v.aroma].add(v.size);
        if (!aromasBySize[v.size]) aromasBySize[v.size] = new Set();
        aromasBySize[v.size].add(v.aroma);
    }

    const sortArr = (s: Set<string>) => [...s].sort();

    return {
        sizesByAroma: Object.fromEntries(
            Object.entries(sizesByAroma).map(([k, v]) => [k, sortArr(v)])
        ),
        aromasBySize: Object.fromEntries(
            Object.entries(aromasBySize).map(([k, v]) => [k, sortArr(v)])
        ),
    };
}

export const getVariantsByProductId = async (productId: number) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!product) {
        throw new NotFoundError('Ürün bulunamadı');
    }

    const variants = await prisma.productVariant.findMany({
        where: { productId },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return variants;
};


export const getVariantById = async (id: number) => {
    const variant = await prisma.productVariant.findUnique({
        where: { id },
        include: {
            product: true,
        },
    });

    if (!variant) {
        throw new NotFoundError('Varyant bulunamadı');
    }

    return variant;
};

export const createVariant = async (data: {
    name: string;
    sku: string;
    price: number;
    stockCount?: number;
    productId: number;
    discount?: number;
    aroma?: string;
    size?: string;
    servings?: string;
    isActive?: boolean;
}) => {
    const existingVariant = await prisma.productVariant.findUnique({
        where: { sku: data.sku },
    });

    if (existingVariant) {
        throw new ConflictError('Bu SKU zaten kullanılıyor');
    }

    const product = await prisma.product.findUnique({
        where: { id: data.productId },
    });

    if (!product) {
        throw new NotFoundError('Ürün bulunamadı');
    }

    if (!product.isActive) {
        throw new BadRequestError('Pasif bir ürüne varyant eklenemez');
    }

    const variant = await prisma.productVariant.create({
        data: {
            name: data.name,
            sku: data.sku,
            price: data.price,
            stockCount: data.stockCount ?? 0,
            productId: data.productId,
            discount: data.discount,
            aroma: data.aroma,
            size: data.size,
            servings: data.servings,
            isActive: data.isActive ?? true,
        },
        include: {
            product: true,
        },
    });

    return variant;
};

export const updateVariant = async (
    id: number,
    data: {
        name?: string;
        sku?: string;
        price?: number;
        stockCount?: number;
        discount?: number;
        aroma?: string;
        size?: string;
        servings?: string;
        isActive?: boolean;
    }
) => {
    await getVariantById(id);

    if (data.sku) {
        const existingVariant = await prisma.productVariant.findUnique({
            where: { sku: data.sku },
        });

        if (existingVariant && existingVariant.id !== id) {
            throw new ConflictError('Bu SKU zaten başka bir varyantта kullanılıyor');
        }
    }

    const variant = await prisma.productVariant.update({
        where: { id },
        data,
        include: {
            product: true,
        },
    });

    return variant;
};


export const deleteVariant = async (id: number) => {
    await getVariantById(id);

    const variant = await prisma.productVariant.delete({
        where: { id },
    });

    return variant;
};