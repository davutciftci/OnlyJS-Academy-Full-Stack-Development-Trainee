import prisma from '../utils/prisma';
import { NotFoundError, BadRequestError } from '../utils/customErrors';
import { OrderStatus } from '../../generated/prisma';


const generatePaymentId = (): string => {
    return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};


const generateConversationId = (): string => {
    return `CONV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

const validateCardNumber = (cardNumber: string): boolean => {
    if (!/^[0-9]{16}$/.test(cardNumber)) {
        return false;
    }

    const testCards = [
        '4111111111111111',
        '5500000000000004',
        '3400000000000009',
    ];

    if (testCards.includes(cardNumber)) {
        return true;
    }

    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

const detectCardType = (cardNumber: string): {
    type: string;
    association: string;
} => {
    const firstDigit = cardNumber[0];
    const firstTwoDigits = cardNumber.substring(0, 2);

    if (firstDigit === '4') {
        return { type: 'CREDIT_CARD', association: 'VISA' };
    } else if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) {
        return { type: 'CREDIT_CARD', association: 'MASTER_CARD' };
    } else if (['34', '37'].includes(firstTwoDigits)) {
        return { type: 'CREDIT_CARD', association: 'AMERICAN_EXPRESS' };
    }

    return { type: 'CREDIT_CARD', association: 'UNKNOWN' };
};

export const processPayment = async (
    orderId: number,
    cardDetails: {
        cardHolderName: string;
        cardNumber: string;
        expireMonth: string;
        expireYear: string;
        cvc: string;
    },
    userId: number
) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            user: true,
        },
    });

    if (!order) {
        throw new NotFoundError('Sipariş bulunamadı');
    }

    if (order.userId !== userId) {
        throw new BadRequestError('Bu sipariş size ait değil');
    }

    if (order.paymentStatus === 'paid') {
        throw new BadRequestError('Bu sipariş zaten ödenmiş');
    }

    if (!validateCardNumber(cardDetails.cardNumber)) {
        throw new BadRequestError('Geçersiz kart numarası');
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const expireYear = parseInt(cardDetails.expireYear);
    const expireMonth = parseInt(cardDetails.expireMonth);

    if (expireYear < currentYear || (expireYear === currentYear && expireMonth < currentMonth)) {
        throw new BadRequestError('Kartın son kullanma tarihi geçmiş');
    }

    const cardInfo = detectCardType(cardDetails.cardNumber);

    const paymentId = generatePaymentId();
    const conversationId = generateConversationId();

    const testCards = ['4111111111111111', '5500000000000004', '3400000000000009'];
    let isSuccess: boolean;

    if (testCards.includes(cardDetails.cardNumber)) {
        isSuccess = true;
    } else {
        isSuccess = Math.random() < 0.9;
    }
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const paymentStatus = isSuccess ? 'SUCCESS' : 'FAILURE';
    const fraudStatus = isSuccess ? 0 : 1;

    const payment = await prisma.payment.create({
        data: {
            paymentId,
            conversationId,
            amount: order.subtotal,
            paidPrice: order.totalAmount,
            status: paymentStatus,
            paymentStatus,
            fraudStatus,
            cardType: cardInfo.type,
            cardAssociation: cardInfo.association,
            cardFamily: 'Standard',
            binNumber: cardDetails.cardNumber.substring(0, 6),
            lastFourDigits: cardDetails.cardNumber.substring(12),
            orderId: order.id,
            iyzicoResponse: {
                mockPayment: true,
                cardHolderName: cardDetails.cardHolderName,
                processedAt: new Date().toISOString(),
                message: isSuccess ? 'Ödeme başarılı' : 'Ödeme reddedildi',
            },
        },
        include: {
            order: true,
        },
    });

    if (isSuccess) {
        await prisma.order.update({
            where: { id: order.id },
            data: {
                status: OrderStatus.CONFIRMED,
                paymentStatus: 'paid',
                paidAt: new Date(),
            },
        });
    } else {
        await prisma.order.update({
            where: { id: order.id },
            data: {
                paymentStatus: 'failed',
            },
        });
    }

    return payment;
};


export const getPaymentStatus = async (orderId: number) => {
    const payment = await prisma.payment.findFirst({
        where: { orderId },
        include: {
            order: {
                select: {
                    orderNumber: true,
                    status: true,
                    totalAmount: true,
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });

    if (!payment) {
        throw new NotFoundError('Ödeme kaydı bulunamadı');
    }

    return payment;
};


export const getTestCards = () => {
    return [
        {
            name: 'Visa Test Card',
            cardNumber: '4111111111111111',
            expireMonth: '12',
            expireYear: '2030',
            cvc: '123',
            cardHolderName: 'TEST USER',
            description: 'Her zaman başarılı',
        },
        {
            name: 'Mastercard Test Card',
            cardNumber: '5500000000000004',
            expireMonth: '12',
            expireYear: '2030',
            cvc: '123',
            cardHolderName: 'TEST USER',
            description: 'Her zaman başarılı',
        },
        {
            name: 'Amex Test Card',
            cardNumber: '3400000000000009',
            expireMonth: '12',
            expireYear: '2030',
            cvc: '123',
            cardHolderName: 'TEST USER',
            description: 'Her zaman başarılı',
        },
    ];
};