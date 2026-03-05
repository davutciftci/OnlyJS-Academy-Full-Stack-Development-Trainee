import { Router } from 'express';
import {
    getAllShippingMethods,
    getAllShippingMethodsAdmin,
    getShippingMethod,
    createShippingMethod,
    updateShippingMethod,
    deleteShippingMethod
} from '../controllers/shipping';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { UserRole } from '../../generated/prisma';

const router = Router();

router.get('/', getAllShippingMethods);

router.get('/admin/all', authenticate, requireRole(UserRole.ADMIN), getAllShippingMethodsAdmin);
router.get('/:id', authenticate, requireRole(UserRole.ADMIN), getShippingMethod);

router.post('/', authenticate, requireRole(UserRole.ADMIN), createShippingMethod);

router.put('/:id', authenticate, requireRole(UserRole.ADMIN), updateShippingMethod);

router.delete('/:id', authenticate, requireRole(UserRole.ADMIN), deleteShippingMethod);

export default router;

