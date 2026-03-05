import { Router } from 'express';
import {
    getProductComments,
    getMyComments,
    getAllComments,
    getComment,
    createNewComment,
    updateCommentById,
    deleteCommentById,
    approveCommentById,
} from '../controllers/productComment';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { validate } from '../middlewares/validate';
import { createCommentSchema, updateCommentSchema, approveCommentSchema } from '../validators/productComment';
import { UserRole } from '../../generated/prisma';
import { commentLimiter } from '../middlewares/rateLimiter';


const router = Router();

router.get('/approved', async (req, res, next) => {
    try {
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const skip = (page - 1) * limit;

        // Toplam yorum sayısını al
        const totalComments = await import('../utils/prisma').then(m => m.default.productComment.count({
            where: { isApproved: true },
        }));

        // Sayfalanmış yorumları al
        const comments = await import('../utils/prisma').then(m => m.default.productComment.findMany({
            where: { isApproved: true },
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
            skip,
            take: limit,
        }));

        res.status(200).json({
            status: 'success',
            results: comments.length,
            data: comments,
            pagination: {
                page,
                limit,
                totalComments,
                totalPages: Math.ceil(totalComments / limit),
            },
        });
    } catch (error) {
        next(error);
    }
});

router.get('/product/:productId', getProductComments);
router.get('/:id', getComment);

router.get('/my/comments', authenticate, getMyComments);
router.post(
    '/',
    authenticate,
    commentLimiter,
    validate(createCommentSchema),
    createNewComment
);
router.put(
    '/:id',
    authenticate,
    validate(updateCommentSchema),
    updateCommentById
);
router.patch(
    '/:id',
    authenticate,
    validate(updateCommentSchema),
    updateCommentById
);
router.delete('/:id', authenticate, deleteCommentById);

router.get(
    '/admin/all',
    authenticate,
    requireRole(UserRole.ADMIN),
    getAllComments
);

router.patch(
    '/:id/approve',
    authenticate,
    requireRole(UserRole.ADMIN),
    validate(approveCommentSchema),
    approveCommentById
);

export default router;