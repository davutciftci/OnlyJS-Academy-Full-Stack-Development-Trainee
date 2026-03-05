import { Request, Response, NextFunction } from 'express';
import {
    getVariantsByProductId,
    getVariantById,
    createVariant,
    updateVariant,
    deleteVariant,
} from '../services/productVariant';
import { asyncHandler } from '../utils/asyncHandler';

export const getProductVariants = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const productId = parseInt(req.params.productId);

    const variants = await getVariantsByProductId(productId);

    res.status(200).json({
        status: 'success',
        results: variants.length,
        data: variants,
    });
});


export const getVariant = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);

    const variant = await getVariantById(id);

    res.status(200).json({
        status: 'success',
        data: variant,
    });
});


export const createNewVariant = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const variant = await createVariant(req.body);

    res.status(201).json({
        status: 'success',
        message: 'Varyant başarıyla oluşturuldu',
        data: variant,
    });
});


export const updateVariantById = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);

    const variant = await updateVariant(id, req.body);

    res.status(200).json({
        status: 'success',
        message: 'Varyant başarıyla güncellendi',
        data: variant,
    });
});


export const deleteVariantById = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);

    await deleteVariant(id);

    res.status(204).send();
});