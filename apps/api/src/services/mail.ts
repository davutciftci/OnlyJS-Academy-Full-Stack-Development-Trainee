import { sendEmail } from '../config/email';
import { orderCancelledEmail, orderConfirmationEmail, orderShippedEmail, orderConfirmedEmail, orderDeliveredEmail, passwordResetEmail, passwordUpdatedEmail, welcomeEmail, contactFormEmail, verificationEmail } from '../templates/email';
import { OrderWithRelations } from '../types';

export const sendWelcomeEmail = async (email: string, firstName: string) => {
    try {
        await sendEmail(email, 'Protein Shop\a Hoş Geldiniz!',
            welcomeEmail(firstName)
        )
    } catch (error) {
        console.error('[EmailService] Failed to send welcome email: ', error)
    }
}

export const sendOrderConfirmationEmail = async (order: OrderWithRelations) => {
    try {
        await sendEmail(
            order.user.email,
            `Siparişiniz Alındı - ${order.orderNumber}`,
            orderConfirmationEmail(order)
        )
    } catch (error) {
        console.error('[EmailService] Failed to send order confirmation email: ', error)
    }
};

export const sendOrderShippedEmail = async (order: OrderWithRelations) => {
    try {
        await sendEmail(
            order.user.email,
            `Siparişiniz Kargoya Verildi - ${order.orderNumber}`,
            orderShippedEmail(order)
        )
    } catch (error) {
        console.error('[EmailService] Failed to send order shipped email: ', error)
    }
}

export const sendOrderCancelledEmail = async (order: OrderWithRelations) => {
    try {
        await sendEmail(
            order.user.email,
            `Siparişiniz İptal Edildi - ${order.orderNumber}`,
            orderCancelledEmail(order)
        )
    } catch (error) {
        console.error('[EmailService] Failed to send order cancelled email: ', error)
    }
};

export const sendOrderConfirmedEmail = async (order: OrderWithRelations) => {
    try {
        await sendEmail(
            order.user.email,
            `Siparişiniz Onaylandı - ${order.orderNumber}`,
            orderConfirmedEmail(order)
        )
    } catch (error) {
        console.error('[EmailService] Failed to send order confirmed email: ', error)
    }
};

export const sendOrderDeliveredEmail = async (order: OrderWithRelations) => {
    try {
        await sendEmail(
            order.user.email,
            `Siparişiniz Teslim Edildi - ${order.orderNumber}`,
            orderDeliveredEmail(order)
        )
    } catch (error) {
        console.error('[EmailService] Failed to send order delivered email: ', error)
    }
};

export const sendPasswordResetEmail = async (email: string, firstName: string, resetToken: string) => {
    try {
        await sendEmail(
            email,
            `Şifre Sıfırla Talebi`,
            passwordResetEmail(firstName, resetToken)
        )
    } catch (error) {
        console.error('[EmailService] Failed to send password reset email: ', error)
    }
}

export const sendPasswordUpdatedEmail = async (email: string, firstName: string) => {
    try {
        await sendEmail(
            email,
            `Şifreniz Güncellendi`,
            passwordUpdatedEmail(firstName)
        )
    } catch (error) {
        console.error('[EmailService] Failed to send password updated email: ', error)
    }
}

export const sendContactFormEmail = async (firstName: string, lastName: string, email: string, message: string) => {
    await sendEmail(
        'prtinnn@gmail.com',
        `Yeni İletişim Mesajı - ${firstName} ${lastName}`,
        contactFormEmail(firstName, lastName, email, message)
    );
}

export const sendVerificationEmail = async (email: string, firstName: string, code: string) => {
    try {
        await sendEmail(
            email,
            'E-posta Doğrulama Kodu',
            verificationEmail(firstName, code)
        )
    } catch (error) {
        console.error('[EmailService] Failed to send verification email: ', error)
    }
}