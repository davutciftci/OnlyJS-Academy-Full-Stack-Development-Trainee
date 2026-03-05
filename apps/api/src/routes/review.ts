import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import * as reviewController from '../controllers/review';
import { createReviewSchema } from '../validators/review';

const router = Router();

router.post('/', authenticate, validate(createReviewSchema), reviewController.createReviewController);

router.get('/product/:productId', reviewController.getProductReviewsController);

router.get('/all', reviewController.getAllReviewsController);

router.get('/my/reviewable', authenticate, reviewController.getMyReviewableOrdersController);

export default router;
