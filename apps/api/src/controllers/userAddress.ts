import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import {
    getAddressesByUserId,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
} from '../services/userAddress';
import { asyncHandler } from '../utils/asyncHandler';


export const getMyAddresses = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.userId!;

    const addresses = await getAddressesByUserId(userId);

    res.status(200).json({
        status: 'success',
        results: addresses.length,
        data: addresses,
    });
});


export const getAddress = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);

    const address = await getAddressById(id);

    res.status(200).json({
        status: 'success',
        data: address,
    });
});


export const createNewAddress = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.userId!;

    const address = await createAddress(req.body, userId);

    res.status(201).json({
        status: 'success',
        message: 'Adres başarıyla oluşturuldu',
        data: address,
    });
});

export const updateAddressById = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId!;

    const address = await updateAddress(id, req.body, userId);

    res.status(200).json({
        status: 'success',
        message: 'Adres başarıyla güncellendi',
        data: address,
    });
});


export const deleteAddressById = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId!;

    await deleteAddress(id, userId);

    res.status(204).send();
});