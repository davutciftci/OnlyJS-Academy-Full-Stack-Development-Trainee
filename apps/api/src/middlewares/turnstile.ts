import { Request, Response, NextFunction } from 'express';

/**
 * Cloudflare Turnstile doğrulama middleware'i
 * Frontend'den gelen 'cf-turnstile-response' token'ını Cloudflare API üzerinden doğrular.
 */
export const validateTurnstile = async (req: Request, res: Response, next: NextFunction) => {
    // Development ortamında ve anahtar eksikliğinde log basıp geçelim (opsiyonel)
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    
    // Test anahtarları kullanılıyorsa veya anahtar yoksa (development kolaylığı)
    if (!secretKey || secretKey.startsWith('1x0000000000000000000000000000000AA')) {
        console.warn('Turnstile: Test anahtarı veya eksik anahtar kullanılıyor. Doğrulama geçiliyor.');
        return next();
    }

    const token = req.body['cf-turnstile-response'];

    if (!token) {
        return res.status(400).json({
            status: 'error',
            message: 'Güvenlik doğrulaması eksik. Lütfen kutucuğu işaretleyin.'
        });
    }

    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: JSON.stringify({
                secret: secretKey,
                response: token,
                remoteip: req.ip
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const outcome = await response.json() as { success: boolean; 'error-codes'?: string[] };

        if (outcome.success) {
            next();
        } else {
            console.error('Turnstile verification failed:', outcome['error-codes']);
            return res.status(403).json({
                status: 'error',
                message: 'Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.'
            });
        }
    } catch (error) {
        console.error('Turnstile verification error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Güvenlik doğrulaması sistem hatası.'
        });
    }
};
