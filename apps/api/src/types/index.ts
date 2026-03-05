import { Prisma } from '../../generated/prisma';

export interface ShippingAddressSnapshot {
    title: string;
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district: string;
    postalCode: string;
}

export type OrderWithRelations = Prisma.OrderGetPayload<{
    include: {
        user: {
            select: {
                id: true;
                firstName: true;
                lastName: true;
                email: true;
            };
        };
        items: {
            include: {
                variant: {
                    include: {
                        product: {
                            select: {
                                id: true;
                                name: true;
                                slug: true;
                            };
                        };
                    };
                };
            };
        };
    };
}> & {
    user: NonNullable<Prisma.OrderGetPayload<{
        include: {
            user: {
                select: {
                    id: true;
                    firstName: true;
                    lastName: true;
                    email: true;
                };
            };
        };
    }>['user']>;
    shippingAddress: ShippingAddressSnapshot;
};

export type OrderItemWithVariant = OrderWithRelations['items'][number];

export type ProductWhereInput = Prisma.ProductWhereInput;
export type ProductOrderByInput = Prisma.ProductOrderByWithRelationInput;
export type ProductVariantWhereInput = Prisma.ProductVariantWhereInput;
export type ProductVariantOrderByInput = Prisma.ProductVariantOrderByWithRelationInput;
export type ProductCommentWhereInput = Prisma.ProductCommentWhereInput;
export type OrderUpdateInput = Prisma.OrderUpdateInput;
