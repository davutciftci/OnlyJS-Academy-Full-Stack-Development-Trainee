import { Request, Response, NextFunction } from 'express';
import {
    getProductById,
    getProductBySlugService,
    createProduct,
    updateProduct,
    deleteProduct,
    searchAndFilterProducts,
    getPaginatedProducts,
} from '../services/product';
import { asyncHandler } from '../utils/asyncHandler';
import { BadRequestError } from '../utils/customErrors';

export const searchProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const filters = {
        search: req.query.search as string,
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        activeOnly: req.query.activeOnly === 'true',
        sortBy: req.query.sortBy as string
    };

    const products = await searchAndFilterProducts(filters);

    // 30 dakika cache
    //res.setHeader('Cache-Control', 'public, max-age=1800');

    res.status(200).json({
        status: 'success',
        results: products.length,
        filter: filters,
        data: products,
    });
});

export const getPaginatedProductsList = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;

    const filters = {
        search: req.query.search as string,
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        activeOnly: req.query.activeOnly === 'true',
        sortBy: req.query.sortBy as string,
    };

    const result = await getPaginatedProducts(filters, page, limit);

    // 30 dakika cache
    //res.setHeader('Cache-Control', 'public, max-age=1800');

    res.status(200).json({
        status: 'success',
        data: result.products,
        pagination: result.pagination,
        filters: filters,
    });
});

export const getProducts = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const filters = {
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
        activeOnly: req.query.activeOnly === 'true',
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
    };

    const products = await searchAndFilterProducts(filters);

    // 30 dakika cache
    //res.setHeader('Cache-Control', 'public, max-age=1800');

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: products,
    });
});

export const getProduct = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);

    const product = await getProductById(id);

    // 30 dakika cache
    //res.setHeader('Cache-Control', 'public, max-age=1800');

    res.status(200).json({
        status: 'success',
        data: product,
    });
});

export const getProductBySlug = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { slug } = req.params;

    const product = await getProductBySlugService(slug);

    // 30 dakika cache
    //res.setHeader('Cache-Control', 'public, max-age=1800');

    res.status(200).json({
        status: 'success',
        data: product,
    });
});

export const createNewProduct = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const product = await createProduct(req.body);

    res.status(201).json({
        status: 'success',
        message: 'Ürün başarıyla oluşturuldu',
        data: product,
    });
});

export const updateProductById = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);

    const product = await updateProduct(id, req.body);

    res.status(200).json({
        status: 'success',
        message: 'Ürün başarıyla güncellendi',
        data: product,
    });
});

export const deleteProductById = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id) || id < 1) {
        throw new BadRequestError('Geçersiz ürün ID');
    }

    await deleteProduct(id);

    res.status(204).send();
});