import { Request, Response, NextFunction } from 'express';
import {
    getCommentsByProductId,
    getCommentsByUserId,
    getCommentById,
    createComment,
    updateComment,
    deleteComment,
    approveComment,
} from '../services/productComment';
import { UserRole } from '../../generated/prisma';
import prisma from '../utils/prisma';
import { AuthenticatedRequest } from '../middlewares/auth';
import { asyncHandler } from '../utils/asyncHandler';


export const getProductComments = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const productId = parseInt(req.params.productId);

    const comments = await getCommentsByProductId(productId, true);

    res.status(200).json({
        status: 'success',
        results: comments.length,
        data: comments,
    });
});


export const getMyComments = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.userId!;

    const comments = await getCommentsByUserId(userId);

    res.status(200).json({
        status: 'success',
        results: comments.length,
        data: comments,
    });
});

export const getAllComments = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const productId = req.query.productId ? parseInt(req.query.productId as string) : undefined;

    let comments;
    if (productId) {
        comments = await getCommentsByProductId(productId, false);
    } else {
        comments = await prisma.productComment.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                product: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    res.status(200).json({
        status: 'success',
        results: comments.length,
        data: comments,
    });
});

export const getComment = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);

    const comment = await getCommentById(id);

    res.status(200).json({
        status: 'success',
        data: comment,
    });
});

export const createNewComment = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.userId!;

    const comment = await createComment(req.body, userId);

    res.status(201).json({
        status: 'success',
        message: 'Yorumunuz başarıyla oluşturuldu. Admin onayından sonra yayınlanacaktır.',
        data: comment,
    });
});

export const updateCommentById = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId!;

    const comment = await updateComment(id, req.body, userId);

    res.status(200).json({
        status: 'success',
        message: 'Yorumunuz güncellendi. Admin onayından sonra yayınlanacaktır.',
        data: comment,
    });
});


export const deleteCommentById = asyncHandler(async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);
    const userId = req.user?.userId!;
    const isAdmin = req.user?.role === UserRole.ADMIN;

    await deleteComment(id, userId, isAdmin);

    res.status(204).send();
});

export const approveCommentById = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = parseInt(req.params.id);
    const { isApproved } = req.body;

    const comment = await approveComment(id, isApproved);

    res.status(200).json({
        status: 'success',
        message: isApproved ? 'Yorum onaylandı' : 'Yorum reddedildi',
        data: comment,
    });
});