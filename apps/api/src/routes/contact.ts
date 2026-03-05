import { Router } from 'express';
import { sendContactMessage } from '../controllers/contact';
import { validate } from '../middlewares/validate';
import { contactSchema } from '../validators/contact';
import { contactLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/submit', contactLimiter, validate(contactSchema), sendContactMessage);

export default router;
