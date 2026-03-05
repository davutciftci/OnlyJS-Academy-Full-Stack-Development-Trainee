import { Router } from 'express';
import {
    getMyAddresses,
    getAddress,
    createNewAddress,
    updateAddressById,
    deleteAddressById,
} from '../controllers/userAddress';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createAddressSchema, updateAddressSchema } from '../validators/userAddress';

const router = Router();


router.use(authenticate);
router.get('/my', getMyAddresses);
router.get('/:id', getAddress);
router.post('/', validate(createAddressSchema), createNewAddress);
router.put('/:id', validate(updateAddressSchema), updateAddressById);
router.delete('/:id', deleteAddressById);

export default router;