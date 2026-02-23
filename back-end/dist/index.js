"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./routes/user"));
const category_1 = __importDefault(require("./routes/category"));
const product_1 = __importDefault(require("./routes/product"));
const productVariant_1 = __importDefault(require("./routes/productVariant"));
const productPhoto_1 = __importDefault(require("./routes/productPhoto"));
const productComment_1 = __importDefault(require("./routes/productComment"));
const userAddress_1 = __importDefault(require("./routes/userAddress"));
const cart_1 = __importDefault(require("./routes/cart"));
const order_1 = __importDefault(require("./routes/order"));
const payment_1 = __importDefault(require("./routes/payment"));
const shipping_1 = __importDefault(require("./routes/shipping"));
const error_1 = require("./middlewares/error");
const path_1 = __importDefault(require("path"));
const adminStats_1 = __importDefault(require("./routes/adminStats"));
const contact_1 = __importDefault(require("./routes/contact"));
const review_1 = __importDefault(require("./routes/review"));
const rateLimiter_1 = require("./middlewares/rateLimiter");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(rateLimiter_1.globalLimiter);
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3001', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const uploadsPath = path_1.default.join(process.cwd(), "uploads");
app.use('/uploads', express_1.default.static(uploadsPath));
app.use('/api/user', user_1.default);
app.use('/api/categories', category_1.default);
app.use('/api/products', product_1.default);
app.use('/api/variants', productVariant_1.default);
app.use('/api/photos', productPhoto_1.default);
app.use('/api/comments', productComment_1.default);
app.use('/api/addresses', userAddress_1.default);
app.use('/api/cart', cart_1.default);
app.use('/api/orders', order_1.default);
app.use('/api/payments', payment_1.default);
app.use('/api/shipping', shipping_1.default);
app.use('/api/admin/stats', adminStats_1.default);
app.use('/api/reviews', review_1.default);
app.use('/api/contact', contact_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running!'
    });
});
app.use(error_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map