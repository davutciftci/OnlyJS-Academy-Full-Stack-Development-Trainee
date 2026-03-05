import { Request, Response, NextFunction } from 'express';
import {
    getOrCreateCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
} from '../services/cart';
import { AuthenticatedRequest } from 'src/middlewares/auth';
import { asyncHandler } from '../utils/asyncHandler';


const calculateDiscountedPrice = (price: number, discount?: number | null): number => {
    if (!discount || discount <= 0) {
        return price;
    }
    return Math.round(price * (1 - discount / 100));
};

export const getCart = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.userId!;

    const cart = await getOrCreateCart(userId);

    const totalPrice = cart.items.reduce((total, item) => {
        const originalPrice = Number(item.variant.price);
        const discount = item.variant.discount;
        const discountedPrice = calculateDiscountedPrice(originalPrice, discount);
        return total + (discountedPrice * item.quantity);
    }, 0);

    res.status(200).json({
        status: 'success',
        data: {
            cart,
            summary: {
                itemCount: cart.items.length,
                totalPrice: totalPrice.toFixed(2),
            },
        },
    });
});

export const addItemToCart = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.userId!;
    const { variantId, quantity } = req.body;

    const cart = await addToCart(userId, variantId, quantity);

    res.status(200).json({
        status: 'success',
        message: 'Ürün sepete eklendi',
        data: cart,
    });
});


export const updateCartItem = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.userId!;
    const itemId = parseInt(req.params.itemId);
    const { quantity } = req.body;

    const cart = await updateCartItemQuantity(userId, itemId, quantity);

    res.status(200).json({
        status: 'success',
        message: 'Ürün miktarı güncellendi',
        data: cart,
    });
});


export const removeCartItem = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.userId!;
    const itemId = parseInt(req.params.itemId);

    const cart = await removeFromCart(userId, itemId);

    res.status(200).json({
        status: 'success',
        message: 'Ürün sepetten çıkarıldı',
        data: cart,
    });
});

export const clearUserCart = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.userId!;

    const cart = await clearCart(userId);

    res.status(200).json({
        status: 'success',
        message: 'Sepet temizlendi',
        data: cart,
    });
});