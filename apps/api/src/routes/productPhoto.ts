import { Router } from 'express';
import {
    getProductPhotos,
    getPhoto,
    createNewPhoto,
    updatePhotoById,
    deletePhotoById,
    uploadPhoto,
} from '../controllers/productPhoto';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { validate } from '../middlewares/validate';
import { createPhotoSchema, updatePhotoSchema } from '../validators/productPhoto';
import { UserRole } from "../../generated/prisma";
import { upload } from '../config/multer';


const router = Router();

router.get('/product/:productId', getProductPhotos);
router.get('/:id', getPhoto);

router.post(
    '/',
    authenticate,
    requireRole(UserRole.ADMIN),
    validate(createPhotoSchema),
    createNewPhoto
);
router.post('/upload',
    authenticate,
    requireRole(UserRole.ADMIN),
    upload.single('photo'),
    uploadPhoto
)

router.put(
    '/:id',
    authenticate,
    requireRole(UserRole.ADMIN),
    validate(updatePhotoSchema),
    updatePhotoById
);

router.delete(
    '/:id',
    authenticate,
    requireRole(UserRole.ADMIN),
    deletePhotoById
);

export default router;