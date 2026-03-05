import { Request, Response, NextFunction } from 'express';
import {
    processPayment,
    getPaymentStatus,
    getTestCards,
} from '../services/payment';
import { AuthenticatedRequest } from '../middlewares/auth';
import { asyncHandler } from '../utils/asyncHandler';


export const makePayment = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.userId!;
    const { orderId, cardDetails } = req.body;

    const payment = await processPayment(orderId, cardDetails, userId);

    res.status(payment.status === 'SUCCESS' ? 200 : 400).json({
        status: payment.status === 'SUCCESS' ? 'success' : 'error',
        message: payment.status === 'SUCCESS' ? 'Ödeme başarılı' : 'Ödeme başarısız',
        data: {
            paymentId: payment.paymentId,
            conversationId: payment.conversationId,
            status: payment.status,
            amount: payment.amount,
            paidPrice: payment.paidPrice,
            cardAssociation: payment.cardAssociation,
            lastFourDigits: payment.lastFourDigits,
            order: {
                orderNumber: payment.order.orderNumber,
                status: payment.order.status,
            },
        },
    });
});


export const checkPaymentStatus = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const orderId = parseInt(req.params.orderId);

    const payment = await getPaymentStatus(orderId);

    res.status(200).json({
        status: 'success',
        data: payment,
    });
});


export const listTestCards = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const cards = getTestCards();

    res.status(200).json({
        status: 'success',
        message: 'Test amaçlı kart bilgileri',
        data: cards,
    });
});