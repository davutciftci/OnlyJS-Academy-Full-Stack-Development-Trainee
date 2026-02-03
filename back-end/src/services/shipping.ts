import prisma from '../utils/prisma';
import { NotFoundError, BadRequestError } from '../utils/customErrors';

export const getAllShippingMethods = async () => {
    const shippingMethods = await prisma.shippingMethod.findMany({
        orderBy: {
            price: 'asc',
        },
    });

    return shippingMethods;
};

export const getActiveShippingMethods = async () => {
    const shippingMethods = await prisma.shippingMethod.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            price: 'asc',
        },
    });

    return shippingMethods;
};

export const getShippingMethodById = async (id: number) => {
    const shippingMethod = await prisma.shippingMethod.findUnique({
        where: { id },
    });

    if (!shippingMethod) {
        throw new NotFoundError('Kargo yöntemi bulunamadı');
    }

    return shippingMethod;
};

export const createShippingMethod = async (data: {
    name: string;
    code: string;
    price: number;
    deliveryDays: string;
    description?: string;
    isActive?: boolean;
}) => {
    const existingMethod = await prisma.shippingMethod.findUnique({
        where: { code: data.code },
    });

    if (existingMethod) {
        throw new BadRequestError('Bu kod ile bir kargo yöntemi zaten mevcut');
    }

    const existingName = await prisma.shippingMethod.findUnique({
        where: { name: data.name },
    });

    if (existingName) {
        throw new BadRequestError('Bu isim ile bir kargo yöntemi zaten mevcut');
    }

    const shippingMethod = await prisma.shippingMethod.create({
        data: {
            name: data.name,
            code: data.code,
            price: data.price,
            deliveryDays: data.deliveryDays,
            description: data.description,
            isActive: data.isActive ?? true,
        },
    });

    return shippingMethod;
};

export const updateShippingMethod = async (
    id: number,
    data: {
        name?: string;
        code?: string;
        price?: number;
        deliveryDays?: string;
        description?: string;
        isActive?: boolean;
    }
) => {
    await getShippingMethodById(id);

    if (data.code) {
        const existingMethod = await prisma.shippingMethod.findFirst({
            where: {
                code: data.code,
                id: { not: id },
            },
        });

        if (existingMethod) {
            throw new BadRequestError('Bu kod ile bir kargo yöntemi zaten mevcut');
        }
    }

    if (data.name) {
        const existingName = await prisma.shippingMethod.findFirst({
            where: {
                name: data.name,
                id: { not: id },
            },
        });

        if (existingName) {
            throw new BadRequestError('Bu isim ile bir kargo yöntemi zaten mevcut');
        }
    }

    const shippingMethod = await prisma.shippingMethod.update({
        where: { id },
        data,
    });

    return shippingMethod;
};

export const deleteShippingMethod = async (id: number) => {
    await getShippingMethodById(id);

    const shippingMethod = await prisma.shippingMethod.delete({
        where: { id },
    });

    return shippingMethod;
};
