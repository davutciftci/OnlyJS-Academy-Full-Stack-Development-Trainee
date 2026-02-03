import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendContactFormEmail } from '../services/mail';

export const sendContactMessage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, message } = req.body;

    await sendContactFormEmail(firstName, lastName, email, message);

    return res.status(200).json({
        status: 'success',
        message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.'
    });
});
