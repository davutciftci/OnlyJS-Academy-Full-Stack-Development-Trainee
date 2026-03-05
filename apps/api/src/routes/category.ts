import { Router } from 'express';
import { createdNewCategory, deleteCategoryById, getCategories, getCategory, updateCategoryById } from '../controllers/category';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { UserRole } from '../../generated/prisma';
import { validate } from '../middlewares/validate';
import { createCategorySchema, updateCategorySchema } from '../validators/category';


const router = Router();

router.get('', getCategories);
router.get('/:id', getCategory)
router.post('/', authenticate, requireRole(UserRole.ADMIN), validate(createCategorySchema), createdNewCategory)
router.put('/:id', authenticate, requireRole(UserRole.ADMIN), validate(updateCategorySchema), updateCategoryById);
router.delete('/:id', authenticate, requireRole(UserRole.ADMIN), deleteCategoryById);

export default router;