import { Request, Response, NextFunction } from 'express';
import {
    getDashboardStats,
    getOrderStatusStats,
    getLast7DaysSales,
    getTopSellingProducts,
    getRecentUsers,
    getLowStockProducts,
    getProductsByCategory,
    getMonthlyRevenue,
} from '../services/adminStats';
import { asyncHandler } from '../utils/asyncHandler';


export const getDashboard = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const stats = await getDashboardStats();

    // 5 dakika cache
    res.setHeader('Cache-Control', 'public, max-age=300');

    res.status(200).json({
        status: 'success',
        data: stats,
    });
});


export const getOrderStatus = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const stats = await getOrderStatusStats();

    // 5 dakika cache
    res.setHeader('Cache-Control', 'public, max-age=300');

    res.status(200).json({
        status: 'success',
        data: stats,
    });
});


export const get7DaysSales = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const sales = await getLast7DaysSales();

    // 5 dakika cache
    res.setHeader('Cache-Control', 'public, max-age=300');

    res.status(200).json({
        status: 'success',
        data: sales,
    });
});


export const getTopProducts = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await getTopSellingProducts(page, limit);

    // 5 dakika cache
    res.setHeader('Cache-Control', 'public, max-age=300');

    res.status(200).json({
        status: 'success',
        results: result.products.length,
        data: result.products,
        pagination: result.pagination,
    });
});


export const getRecentUsersList = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const result = await getRecentUsers(page, limit);

    // 5 dakika cache
    res.setHeader('Cache-Control', 'public, max-age=300');

    res.status(200).json({
        status: 'success',
        results: result.users.length,
        data: result.users,
        pagination: result.pagination,
    });
});


export const getLowStock = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const threshold = req.query.threshold ? parseInt(req.query.threshold as string) : 10;

    const result = await getLowStockProducts(page, limit, threshold);

    // 5 dakika cache
    res.setHeader('Cache-Control', 'public, max-age=300');

    res.status(200).json({
        status: 'success',
        results: result.products.length,
        data: result.products,
        pagination: result.pagination,
    });
});


export const getCategoryDistribution = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const distribution = await getProductsByCategory();

    // 5 dakika cache
    res.setHeader('Cache-Control', 'public, max-age=300');

    res.status(200).json({
        status: 'success',
        data: distribution,
    });
});


export const getMonthlyReport = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;

    const report = await getMonthlyRevenue(year);

    // 5 dakika cache
    res.setHeader('Cache-Control', 'public, max-age=300');

    res.status(200).json({
        status: 'success',
        data: report,
    });
});