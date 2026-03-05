import { Request, Response, NextFunction } from 'express';
import {
    getOrdersByUserId,
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    cancelOrder,
} from '../services/order';
import { OrderStatus } from '../../generated/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';
import { asyncHandler } from '../utils/asyncHandler';

export const getMyOrders = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.userId!;

    const orders = await getOrdersByUserId(userId);

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: orders,
    });
});


export const getOrders = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const orders = await getAllOrders();

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: orders,
    });
});


export const getOrder = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId!;
    const isAdmin = req.user?.role === 'ADMIN';

    const order = await getOrderById(id);

    if (!isAdmin && order.userId !== userId) {
        return res.status(403).json({
            status: 'error',
            message: 'Bu siparişe erişim yetkiniz yok',
        });
    }

    res.status(200).json({
        status: 'success',
        data: order,
    });
});

export const createNewOrder = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.userId!;
    const { shippingAddressId, paymentMethod, shippingMethodCode } = req.body;

    const order = await createOrder(userId, shippingAddressId, paymentMethod || 'MANUAL', shippingMethodCode);

    res.status(201).json({
        status: 'success',
        message: 'Siparişiniz başarıyla oluşturuldu',
        data: order,
    });
});


export const updateStatus = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);
    const { status, trackingNumber, cancelReason } = req.body;

    const order = await updateOrderStatus(id, status as OrderStatus, trackingNumber, cancelReason);

    res.status(200).json({
        status: 'success',
        message: 'Sipariş durumu güncellendi',
        data: order,
    });
});


export const cancelUserOrder = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId!;
    const { cancelReason } = req.body;

    const order = await cancelOrder(id, userId, cancelReason);

    res.status(200).json({
        status: 'success',
        message: 'Sipariş iptal edildi',
        data: order,
    });
});