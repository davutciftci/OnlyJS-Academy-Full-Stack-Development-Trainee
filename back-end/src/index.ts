import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/user';
import categoryRouter from './routes/category';
import productRouter from './routes/product';
import productVariantRouter from './routes/productVariant';
import productPhotoRouter from './routes/productPhoto';
import productCommentRouter from './routes/productComment';
import userAddressRouter from './routes/userAddress';
import cartRouter from './routes/cart';
import orderRouter from './routes/order';
import paymentRouter from './routes/payment';
import shippingRouter from './routes/shipping';
import { errorHandler } from './middlewares/error';
import path from 'path';
import adminStatsRouter from './routes/adminStats';
import contactRouter from './routes/contact';
import reviewRouter from './routes/review';
import { globalLimiter } from './middlewares/rateLimiter';
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(globalLimiter);



app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3001', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const uploadsPath = path.join(process.cwd(), "uploads");
app.use('/uploads', express.static(uploadsPath));

app.use('/api/user', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/variants', productVariantRouter);
app.use('/api/photos', productPhotoRouter);
app.use('/api/comments', productCommentRouter);
app.use('/api/addresses', userAddressRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/shipping', shippingRouter);
app.use('/api/admin/stats', adminStatsRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/contact', contactRouter);

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running!'
    });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
