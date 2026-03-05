export type OrderStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'PREPARING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';

export interface ShippingAddress {
    title: string;
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district: string;
    postalCode: string;
}

export interface OrderItem {
    id: number;
    productName: string;
    variantName: string;
    sku: string;
    price: string;
    quantity: number;
    subtotal: string;
    productSnapshot: Record<string, unknown>;
    orderId: number;
    variantId: number;
}

export interface Order {
    id: number;
    orderNumber: string;
    status: OrderStatus;
    subtotal: string;
    shippingCost: string;
    taxAmount: string;
    totalAmount: string;
    shippingAddress: ShippingAddress;
    paymentMethod?: string;
    paymentStatus?: string;
    paidAt?: string;
    trackingNumber?: string;
    shippedAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;
    cancelReason?: string;
    items: OrderItem[];
    createdAt: string;
    updatedAt?: string;
}

export interface CreateOrderRequest {
    addressId: number;
    paymentMethod: string;
}

export interface CancelOrderRequest {
    cancelReason: string;
}

export interface PaymentCardDetails {
    cardHolderName: string;
    cardNumber: string;
    expireMonth: string;
    expireYear: string;
    cvc: string;
}

export interface ProcessPaymentRequest {
    orderId: number;
    cardDetails: PaymentCardDetails;
}

export interface PaymentResponse {
    paymentId: string;
    status: 'SUCCESS' | 'FAILURE';
    amount: string;
    paidPrice: string;
    cardAssociation?: string;
    lastFourDigits?: string;
}
