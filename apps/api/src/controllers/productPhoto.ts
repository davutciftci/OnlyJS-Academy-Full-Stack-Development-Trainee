import { Request, Response, NextFunction } from 'express';
import {
    getPhotosByProductId,
    getPhotoById,
    createPhoto,
    updatePhoto,
    deletePhoto,
} from '../services/productPhoto';
import { BadRequestError } from '../utils/customErrors';
import { asyncHandler } from '../utils/asyncHandler';


export const getProductPhotos = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const productId = parseInt(req.params.productId);

    const photos = await getPhotosByProductId(productId);

    // 24 saat cache
    //res.setHeader('Cache-Control', 'public, max-age=86400'); 

    res.status(200).json({
        status: 'success',
        results: photos.length,
        data: photos,
    });
});

export const getPhoto = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);

    const photo = await getPhotoById(id);

    // 24 saat cache
    //res.setHeader('Cache-Control', 'public, max-age=86400'); 

    res.status(200).json({
        status: 'success',
        data: photo,
    });
});

export const createNewPhoto = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const photo = await createPhoto(req.body);

    res.status(201).json({
        status: 'success',
        message: 'Fotoğraf başarıyla eklendi',
        data: photo,
    });
});

export const uploadPhoto = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        throw new BadRequestError("Dosya yüklenemedi");
    }

    const fileUrl = `/uploads/products/${req.file.filename}`;

    res.status(200).json({
        status: 'success',
        message: 'Fotoğraf başarıyla yüklendi',
        data: {
            url: fileUrl,
            filename: req.file.filename
        },
    });
});

export const updatePhotoById = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);

    const photo = await updatePhoto(id, req.body);

    res.status(200).json({
        status: 'success',
        message: 'Fotoğraf başarıyla güncellendi',
        data: photo,
    });
});


export const deletePhotoById = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);

    await deletePhoto(id);

    res.status(204).send();
});