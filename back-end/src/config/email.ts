import nodemailer from 'nodemailer';

const emailPassword = process.env.EMAIL_PASSWORD?.replace(/\s/g, '') || '';

export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: emailPassword
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('[EMAIL] Error verifying email: ', error);
    }
})

export const sendEmail = async (to: string, subject: string, html: string, text?: string) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
            text
        })
        return info
    } catch (error: any) {
        console.error('[EMAIL] Failed to send email: ', error);
        
        if (error.code === 'EAUTH' || error.responseCode === 535) {
            throw new Error('Email gönderimi başarısız: Email kimlik doğrulama hatası. Lütfen sistem yöneticisiyle iletişime geçin.');
        }
        
        if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
            throw new Error('Email gönderimi başarısız: Email sunucusuna bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
        }
        

        if (error.responseCode === 550 || error.code === 'EENVELOPE') {
            throw new Error('Email gönderimi başarısız: Geçersiz email adresi.');
        }
        

        throw new Error('Email gönderimi başarısız: Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
}