import prisma from '../utils/prisma';
import { NotFoundError, BadRequestError } from '../utils/customErrors';

export const getPhotosByProductId = async (productId: number) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!product) {
        throw new NotFoundError('Ürün bulunamadı');
    }

    const photos = await prisma.productPhoto.findMany({
        where: { productId },
        orderBy: [
            { isPrimary: 'desc' },
            { displayOrder: 'asc' },
        ],
    });

    return photos;
};

export const getPhotoById = async (id: number) => {
    const photo = await prisma.productPhoto.findUnique({
        where: { id },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    if (!photo) {
        throw new NotFoundError('Fotoğraf bulunamadı');
    }

    return photo;
};

export const createPhoto = async (data: {
    url: string;
    altText?: string;
    isPrimary?: boolean;
    displayOrder?: number;
    productId: number;
}) => {
    const product = await prisma.product.findUnique({
        where: { id: data.productId },
    });

    if (!product) {
        throw new NotFoundError('Ürün bulunamadı');
    }

    if (!product.isActive) {
        throw new BadRequestError('Pasif bir ürüne fotoğraf eklenemez');
    }

    if (data.isPrimary) {
        await prisma.productPhoto.updateMany({
            where: {
                productId: data.productId,
                isPrimary: true,
            },
            data: { isPrimary: false },
        });
    }

    const photo = await prisma.productPhoto.create({
        data: {
            url: data.url,
            altText: data.altText,
            isPrimary: data.isPrimary ?? false,
            displayOrder: data.displayOrder ?? 0,
            productId: data.productId,
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    return photo;
};

export const updatePhoto = async (
    id: number,
    data: {
        url?: string;
        altText?: string;
        isPrimary?: boolean;
        displayOrder?: number;
    }
) => {
    const existingPhoto = await getPhotoById(id);

    if (data.isPrimary === true) {
        await prisma.productPhoto.updateMany({
            where: {
                productId: existingPhoto.productId,
                isPrimary: true,
                id: { not: id },
            },
            data: { isPrimary: false },
        });
    }

    const photo = await prisma.productPhoto.update({
        where: { id },
        data,
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    return photo;
};

export const deletePhoto = async (id: number) => {

    await getPhotoById(id);

    const photo = await prisma.productPhoto.delete({
        where: { id },
    });

    return photo;
};