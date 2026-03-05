import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});

let redisErrorLogged = false;

redisClient.on('error', () => {
    if (!redisErrorLogged) {
        console.warn('⚠️  Redis bağlantısı kurulamadı (port 6379). Redis gerektiren özellikler devre dışı.');
        redisErrorLogged = true;
    }
});
redisClient.on('connect', () => {
    redisErrorLogged = false;
    console.log('🚀 Redis Client Connected');
});
redisClient.on('ready', () => console.log('✅ Redis Client Ready'));

export const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch {
        // Hata zaten 'error' event'inde loglandı, sunucu yine de çalışır.
    }
};

export default redisClient;
