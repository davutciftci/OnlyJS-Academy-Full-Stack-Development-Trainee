import prisma from '../utils/prisma';
import { NotFoundError, UnauthorizedError } from '../utils/customErrors';


export const getAddressesByUserId = async (userId: number) => {
    const addresses = await prisma.userAddress.findMany({
        where: { userId },
        orderBy: [
            { isDefault: 'desc' },
            { createdAt: 'desc' },
        ],
    });

    return addresses;
};

export const getAddressById = async (id: number) => {

    const address = await prisma.userAddress.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
        },
    });

    if (!address) {
        throw new NotFoundError('Adres bulunamadı');
    }

    return address;
};

export const createAddress = async (
    data: {
        title: string;
        fullName: string;
        phoneNumber: string;
        addressLine1: string;
        city: string;
        district: string;
        postalCode?: string;
        isDefault?: boolean;
    },
    userId: number
) => {
    const existingAddressCount = await prisma.userAddress.count({
        where: { userId },
    });

    const isFirstAddress = existingAddressCount === 0;
    const shouldBeDefault = data.isDefault || isFirstAddress;

    if (shouldBeDefault) {
        await prisma.userAddress.updateMany({
            where: {
                userId,
                isDefault: true,
            },
            data: { isDefault: false },
        });
    }

    const address = await prisma.userAddress.create({
        data: {
            ...data,
            userId,
            isDefault: shouldBeDefault,
        },
    });

    return address;
};

export const updateAddress = async (
    id: number,
    data: {
        title?: string;
        fullName?: string;
        phoneNumber?: string;
        addressLine1?: string;
        city?: string;
        district?: string;
        postalCode?: string;
        isDefault?: boolean;
    },
    userId: number
) => {
    const existingAddress = await getAddressById(id);

    if (existingAddress.userId !== userId) {
        throw new UnauthorizedError('Bu adresi güncelleme yetkiniz yok');
    }

    if (data.isDefault === true) {
        await prisma.userAddress.updateMany({
            where: {
                userId,
                isDefault: true,
                id: { not: id },
            },
            data: { isDefault: false },
        });
    }

    const address = await prisma.userAddress.update({
        where: { id },
        data,
    });

    return address;
};

export const deleteAddress = async (id: number, userId: number) => {
    const existingAddress = await getAddressById(id);

    if (existingAddress.userId !== userId) {
        throw new UnauthorizedError('Bu adresi silme yetkiniz yok');
    }

    const address = await prisma.userAddress.delete({
        where: { id },
    });


    if (existingAddress.isDefault) {
        const anotherAddress = await prisma.userAddress.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        if (anotherAddress) {
            await prisma.userAddress.update({
                where: { id: anotherAddress.id },
                data: { isDefault: true },
            });
        }
    }

    return address;
};