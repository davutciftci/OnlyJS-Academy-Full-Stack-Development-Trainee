import prisma from '../utils/prisma';
import { NotFoundError, BadRequestError } from '../utils/customErrors';

export const getOrCreateCart = async (userId: number) => {
    let cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    variant: {
                        include: {
                            product: {
                                include: {
                                    photos: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        photos: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    return cart;
};


export const addToCart = async (userId: number, variantId: number, quantity: number) => {
    const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
        include: {
            product: true,
        },
    });

    if (!variant) {
        throw new NotFoundError('Ürün varyantı bulunamadı');
    }

    if (!variant.isActive || !variant.product.isActive) {
        throw new BadRequestError('Bu ürün şu an satışta değil');
    }

    if (variant.stockCount < quantity) {
        throw new BadRequestError(`Yetersiz stok. Mevcut: ${variant.stockCount}`);
    }

    const cart = await getOrCreateCart(userId);

    const existingItem = await prisma.cartItem.findUnique({
        where: {
            cartId_variantId: {
                cartId: cart.id,
                variantId,
            },
        },
    });

    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (variant.stockCount < newQuantity) {
            throw new BadRequestError(`Yetersiz stok. Mevcut: ${variant.stockCount}`);
        }

        await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: newQuantity },
        });
    } else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                variantId,
                productId: variant.product.id,
                quantity,
            },
        });
    }

    return await getOrCreateCart(userId);
};


export const updateCartItemQuantity = async (userId: number, itemId: number, quantity: number) => {
    const cartItem = await prisma.cartItem.findUnique({
        where: { id: itemId },
        include: {
            cart: true,
            variant: true,
        },
    });

    if (!cartItem) {
        throw new NotFoundError('Sepet ürünü bulunamadı');
    }

    if (cartItem.cart.userId !== userId) {
        throw new BadRequestError('Bu sepet size ait değil');
    }

    if (cartItem.variant.stockCount < quantity) {
        throw new BadRequestError(`Yetersiz stok. Mevcut: ${cartItem.variant.stockCount}`);
    }

    await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
    });

    return await getOrCreateCart(userId);
};


export const removeFromCart = async (userId: number, itemId: number) => {

    const cartItem = await prisma.cartItem.findUnique({
        where: { id: itemId },
        include: {
            cart: true,
        },
    });

    if (!cartItem) {
        throw new NotFoundError('Sepet ürünü bulunamadı');
    }

    if (cartItem.cart.userId !== userId) {
        throw new BadRequestError('Bu sepet size ait değil');
    }

    await prisma.cartItem.delete({
        where: { id: itemId },
    });

    return await getOrCreateCart(userId);
};

export const clearCart = async (userId: number) => {

    const cart = await getOrCreateCart(userId);

    await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
    });

    return await getOrCreateCart(userId);
};