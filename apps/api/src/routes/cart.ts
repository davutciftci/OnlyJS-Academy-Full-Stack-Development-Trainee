import { Router } from 'express';
import {
    getCart,
    addItemToCart,
    updateCartItem,
    removeCartItem,
    clearUserCart,
} from '../controllers/cart';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { addToCartSchema, updateCartItemSchema } from '../validators/cart';

const router = Router();

router.use(authenticate);
router.get('/', getCart);
router.post('/items', validate(addToCartSchema), addItemToCart);
router.put('/items/:itemId', validate(updateCartItemSchema), updateCartItem);
router.delete('/items/:itemId', removeCartItem);
router.delete('/', clearUserCart);

export default router;