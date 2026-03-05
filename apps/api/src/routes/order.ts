import { Router } from 'express';
import {
    getMyOrders,
    getOrders,
    getOrder,
    createNewOrder,
    updateStatus,
    cancelUserOrder,
} from '../controllers/order';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { validate } from '../middlewares/validate';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order';
import { UserRole } from '../../generated/prisma';


const router = Router();

router.use(authenticate);

router.get('/my', getMyOrders);
router.get('/:id', getOrder);
router.post('/', validate(createOrderSchema), createNewOrder);
router.post('/:id/cancel', cancelUserOrder);
router.get(
    '/',
    requireRole(UserRole.ADMIN),
    getOrders
);

router.patch(
    '/:id/status',
    requireRole(UserRole.ADMIN),
    validate(updateOrderStatusSchema),
    updateStatus
);

export default router;