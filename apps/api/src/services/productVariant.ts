import prisma from '../utils/prisma';
import { ConflictError, NotFoundError, BadRequestError } from '../utils/customErrors';


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