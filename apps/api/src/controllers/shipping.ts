import prisma from '../utils/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { Request, Response } from 'express';
import * as shippingService from '../services/shipping';

export const getAllShippingMethods = asyncHandler(async (req: Request, res: Response) => {
    const shippingMethods = await shippingService.getActiveShippingMethods();

    const fixedMethods = shippingMethods.map(method => ({
        ...method,
        deliveryDays: method.deliveryDays
            .replace(/i\?\?/g, 'iş')
            .replace(/g\?\?n\?\?/g, 'günü')
    }));

    return res.status(200).json({
        status: 'success',
        data: fixedMethods
    });
});

export const getAllShippingMethodsAdmin = asyncHandler(async (req: Request, res: Response) => {
    const shippingMethods = await shippingService.getAllShippingMethods();

    return res.status(200).json({
        status: 'success',
        results: shippingMethods.length,
        data: shippingMethods
    });
});

export const getShippingMethod = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const shippingMethod = await shippingService.getShippingMethodById(id);

    return res.status(200).json({
        status: 'success',
        data: shippingMethod
    });
});

export const createShippingMethod = asyncHandler(async (req: Request, res: Response) => {
    const shippingMethod = await shippingService.createShippingMethod(req.body);

    return res.status(201).json({
        status: 'success',
        message: 'Kargo yöntemi başarıyla oluşturuldu',
        data: shippingMethod
    });
});

export const updateShippingMethod = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const shippingMethod = await shippingService.updateShippingMethod(id, req.body);

    return res.status(200).json({
        status: 'success',
        message: 'Kargo yöntemi başarıyla güncellendi',
        data: shippingMethod
    });
});

export const deleteShippingMethod = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await shippingService.deleteShippingMethod(id);

    return res.status(204).send();
});

