import { Router } from 'express';
import {
    getDashboard,
    getOrderStatus,
    get7DaysSales,
    getTopProducts,
    getRecentUsersList,
    getLowStock,
    getCategoryDistribution,
    getMonthlyReport,
} from '../controllers/adminStats';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { UserRole } from '../../generated/prisma';

const router = Router();

router.use(authenticate);
router.use(requireRole(UserRole.ADMIN));

router.get('/dashboard', getDashboard);
router.get('/order-status', getOrderStatus);
router.get('/sales/7days', get7DaysSales);
router.get('/top-products', getTopProducts);
router.get('/recent-users', getRecentUsersList);
router.get('/low-stock', getLowStock);
router.get('/products-by-category', getCategoryDistribution);
router.get('/monthly-revenue', getMonthlyReport);

export default router;