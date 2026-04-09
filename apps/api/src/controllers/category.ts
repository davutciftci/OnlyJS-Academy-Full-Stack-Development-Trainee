import { NextFunction, Request, Response } from "express";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../services/category";
import { asyncHandler } from "../utils/asyncHandler";

export const getCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const activeOnly = req.query.activeOnly === 'true';
    const categories = await getAllCategories(activeOnly);

    // 1 saat cache
    //res.setHeader('Cache-Control', 'public, max-age=3600');

    res.status(200).json({
        status: 'success',
        result: categories.length,
        data: categories,
    });
});

export const getCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const category = await getCategoryById(id);

    // 1 saat cache
    //res.setHeader('Cache-Control', 'public, max-age=3600');

    res.status(200).json({
        status: 'success',
        result: category,
    });
});

export const createdNewCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const category = await createCategory(req.body);

    res.status(201).json({
        status: 'success',
        message: 'Kategori başarıyla oluşturuldu',
        data: category,
    });
});

export const updateCategoryById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    const category = await updateCategory(id, req.body);

    res.status(200).json({
        status: 'success',
        message: 'Kategori başarıyla güncellendi',
        data: category,
    });
});

export const deleteCategoryById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    await deleteCategory(id);

    res.status(204).send();
});