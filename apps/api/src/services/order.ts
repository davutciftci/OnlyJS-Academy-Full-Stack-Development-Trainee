import prisma from '../utils/prisma';
import { NotFoundError, BadRequestError, UnauthorizedError } from '../utils/customErrors';
import { OrderStatus } from '../../generated/prisma';
import { sendOrderCancelledEmail, sendOrderConfirmationEmail, sendOrderShippedEmail, sendOrderConfirmedEmail, sendOrderDeliveredEmail } from './mail';
import { OrderWithRelations } from '../types';

const generateOrderNumber = async (): Promise<string> => {
    const year = new Date().getFullYear();
    const prefix = `ORD-${year}-`;

    const count = await prisma.order.count({
        where: {
            orderNumber: {
                startsWith: prefix,
            },
        },
    });


    const sequence = String(count + 1).padStart(4, '0');

    return `${prefix}${sequence}`;
};


export const getOrdersByUserId = async (userId: number) => {
    const orders = await prisma.order.findMany({
        where: { userId },
        include: {
            items: {
                include: {
                    variant: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return orders;
};


export const getAllOrders = async () => {

    const orders = await prisma.order.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            items: {
                include: {
                    variant: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                },
                            },
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return orders;
};


export const getOrderById = async (id: number) => {

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            items: {
                include: {
                    variant: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    photos: {
                                        select: {
                                            url: true,
                                            isPrimary: true,
                                        },
                                    },
                                    category: {
                                        select: {
                                            slug: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    productComments: {
                        select: {
                            id: true,
                            title: true,
                            rating: true,
                            comment: true,
                            userId: true,
                            isApproved: true,
                        },
                    },
                },
            },
        },
    });

    if (!order) {
        throw new NotFoundError('Sipariş bulunamadı');
    }
    return order;
};


export const createOrder = async (
    userId: number,
    addressId: number,
    paymentMethod: string,
    shippingMethodCode: string
) => {
    const address = await prisma.userAddress.findUnique({
        where: { id: addressId },
    });

    if (!address) {
        throw new NotFoundError('Adres bulunamadı');
    }

    if (address.userId !== userId) {
        throw new UnauthorizedError('Bu adres size ait değil');
    }

    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    variant: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
        },
    });

    if (!cart || cart.items.length === 0) {
        throw new BadRequestError('Sepetiniz boş');
    }

    for (const item of cart.items) {
        if (item.variant.stockCount < item.quantity) {
            throw new BadRequestError(`Yetersiz stok: ${item.variant.name}`);
        }

        if (!item.variant.isActive || !item.variant.product.isActive) {
            throw new BadRequestError(`Bu ürün artık satışta değil: ${item.variant.name}`);
        }
    }

    const calculateDiscountedPrice = (price: number, discount?: number | null): number => {
        if (!discount || discount <= 0) {
            return price;
        }
        return Math.round(price * (1 - discount / 100));
    };

    const processedCartItems = cart.items.map(item => {
        const originalPrice = Number(item.variant.price);
        const discountedPrice = calculateDiscountedPrice(originalPrice, item.variant.discount);
        return {
            ...item,
            discountedPrice,
            itemSubtotal: discountedPrice * item.quantity
        };
    });

    const subtotal = processedCartItems.reduce((total, item) => total + item.itemSubtotal, 0);

    const shippingMethod = await prisma.shippingMethod.findUnique({
        where: { code: shippingMethodCode }
    });

    if (!shippingMethod) {
        throw new Error('Geçersiz kargo metodu');
    }

    const shippingCost = Number(shippingMethod.price);
    const totalAmount = subtotal + shippingCost;

    const shippingAddressSnapshot = {
        title: address.title,
        fullName: address.fullName,
        phoneNumber: address.phoneNumber,
        addressLine1: address.addressLine1,
        city: address.city,
        district: address.district,
        postalCode: address.postalCode,
    };

    const orderNumber = await generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
            data: {
                orderNumber,
                userId,
                subtotal,
                shippingCost,
                taxAmount: 0,
                totalAmount,
                shippingAddress: shippingAddressSnapshot,
                paymentMethod,
                status: OrderStatus.PENDING,
            },
        });

        for (const item of processedCartItems) {
            const productSnapshot = {
                productId: item.variant.product.id,
                productName: item.variant.product.name,
                productSlug: item.variant.product.slug,
                variantId: item.variant.id,
                variantName: item.variant.name,
                variantSku: item.variant.sku,
                variantAroma: item.variant.aroma,
                variantSize: item.variant.size,
                variantServings: item.variant.servings,
            };

            await tx.orderItem.create({
                data: {
                    orderId: newOrder.id,
                    variantId: item.variant.id,
                    productId: item.variant.product.id,
                    productName: item.variant.product.name,
                    variantName: item.variant.name,
                    sku: item.variant.sku,
                    price: item.discountedPrice,
                    quantity: item.quantity,
                    subtotal: item.itemSubtotal,
                    productSnapshot,
                },
            });

            await tx.productVariant.update({
                where: { id: item.variant.id },
                data: {
                    stockCount: {
                        decrement: item.quantity,
                    },
                },
            });
        }

        await tx.cartItem.deleteMany({
            where: { cartId: cart.id },
        });

        return newOrder;
    });

    const fullOrder = await getOrderById(order.id);

    sendOrderConfirmationEmail(fullOrder as unknown as OrderWithRelations).catch(err => {
        console.error('[OrderService] Order confirmation email failed:', err);
    });

    return fullOrder;
};

export const updateOrderStatus = async (
    orderId: number,
    status: OrderStatus,
    trackingNumber?: string,
    cancelReason?: string
) => {
    const order = await getOrderById(orderId);

    const updateData: any = { status };

    if (status === OrderStatus.CONFIRMED) {
        updateData.paidAt = new Date();
        updateData.paymentStatus = 'paid';
    }

    if (status === OrderStatus.SHIPPED) {
        updateData.shippedAt = new Date();
        if (trackingNumber) {
            updateData.trackingNumber = trackingNumber;
        }
    }

    if (status === OrderStatus.DELIVERED) {
        updateData.deliveredAt = new Date();
    }

    if (status === OrderStatus.CANCELLED) {
        updateData.cancelledAt = new Date();
        if (cancelReason) {
            updateData.cancelReason = cancelReason;
        }

        await prisma.$transaction(async (tx) => {
            for (const item of order.items) {
                if (item.variantId === null) continue;
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: {
                        stockCount: {
                            increment: item.quantity,
                        },
                    },
                });
            }
        });
    }

    const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: updateData,
    });


    const fullOrder = await getOrderById(orderId);

    if (status === OrderStatus.CONFIRMED) {
        sendOrderConfirmedEmail(fullOrder as unknown as OrderWithRelations).catch(err => {
            console.error('[OrderService] Failed to send order confirmed email: ', err);
        });
    }

    if (status === OrderStatus.SHIPPED) {
        sendOrderShippedEmail(fullOrder as unknown as OrderWithRelations).catch(err => {
            console.error('[OrderService] Failed to send order shipped email: ', err);
        });
    }

    if (status === OrderStatus.DELIVERED) {
        sendOrderDeliveredEmail(fullOrder as unknown as OrderWithRelations).catch(err => {
            console.error('[OrderService] Failed to send order delivered email: ', err);
        });
    }

    if (status === OrderStatus.CANCELLED) {
        sendOrderCancelledEmail(fullOrder as unknown as OrderWithRelations).catch(err => {
            console.error('[OrderService] Failed to send order cancelled email: ', err);
        });
    }
    return fullOrder;
};

export const cancelOrder = async (orderId: number, userId: number, cancelReason: string) => {
    const order = await getOrderById(orderId);

    if (order.userId !== userId) {
        throw new UnauthorizedError('Bu sipariş size ait değil');
    }

    const cancellableStatuses: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.CONFIRMED];
    if (!cancellableStatuses.includes(order.status)) {
        throw new BadRequestError('Bu sipariş artık iptal edilemez');
    }

    return await updateOrderStatus(orderId, OrderStatus.CANCELLED, undefined, cancelReason);
};