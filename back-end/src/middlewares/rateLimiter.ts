import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 dakika
    max: 5,
    message: {
        status: 'error',
        message: 'Çok fazla giriş denemesi yaptınız. Lütfen bir dakika sonra tekrar deneyin.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authSensitiveLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 dakika
    max: 3,
    message: {
        status: 'error',
        message: 'Bu işlem için çok fazla istek gönderdiniz. Lütfen bir süre sonra tekrar deneyin.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const paymentLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 dakika
    max: 3,
    message: {
        status: 'error',
        message: 'Ödeme denemesi limitine ulaştınız. Güvenliğiniz için lütfen biraz bekleyin.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 saat
    max: 3,
    message: {
        status: 'error',
        message: 'Çok fazla iletişim formu gönderdiniz. Lütfen daha sonra tekrar deneyin.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const commentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 saat
    max: 10,
    message: {
        status: 'error',
        message: 'Yorum yapma limitine ulaştınız. Lütfen bir saat sonra tekrar deneyin.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const searchLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 dakika
    max: 10,
    message: {
        status: 'error',
        message: 'Çok fazla arama yaptınız. Lütfen biraz bekleyin.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const globalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 dakika
    max: 50,
    message: {
        status: 'error',
        message: 'Çok fazla istek gönderdiniz. Lütfen bir dakika sonra tekrar deneyin.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
