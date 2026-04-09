import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import * as reviewService from '../services/review';
import { asyncHandler } from '../utils/asyncHandler';

export const createReviewController = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.userId!;
    const { productId, orderId, orderItemId, rating, comment } = req.body;

    const review = await reviewService.createReview(
        userId,
        productId,
        orderId,
        orderItemId,
        rating,
        comment
    );

    // 10 dakika cache
    //res.setHeader('Cache-Control', 'public, max-age=600');

    res.status(201).json({
        status: 'success',
        message: 'Yorumunuz başarıyla gönderildi. Onaylandıktan sonra yayınlanacaktır.',
        data: review
    });
});

export const getProductReviewsController = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const productId = parseInt(req.params.productId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await reviewService.getProductReviews(productId, page, limit);

    // 10 dakika cache
    //res.setHeader('Cache-Control', 'public, max-age=600');

    res.status(200).json({
        status: 'success',
        results: result.reviews.length,
        data: result.reviews,
        pagination: result.pagination,
    });
});

export const getAllReviewsController = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await reviewService.getAllApprovedReviews(page, limit);

    res.status(200).json({
        status: 'success',
        results: result.reviews.length,
        data: result.reviews,
        pagination: result.pagination,
    });
});

export const getMyReviewableOrdersController = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.userId!;
    const orders = await reviewService.getUserReviewableOrders(userId);

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: orders
    });
});
