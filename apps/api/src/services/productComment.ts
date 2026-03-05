import prisma from '../utils/prisma';
import { NotFoundError, UnauthorizedError, BadRequestError } from '../utils/customErrors';
import { ProductCommentWhereInput } from '../types';

export const getCommentsByProductId = async (productId: number, approvedOnly: boolean = true) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!product) {
        throw new NotFoundError('Ürün bulunamadı');
    }

    const where: ProductCommentWhereInput = { productId };
    if (approvedOnly) {
        where.isApproved = true;
    }

    const comments = await prisma.productComment.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return comments;
};

export const getCommentsByUserId = async (userId: number) => {

    const comments = await prisma.productComment.findMany({
        where: { userId },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return comments;
};

export const getCommentById = async (id: number) => {
    const comment = await prisma.productComment.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    if (!comment) {
        throw new NotFoundError('Yorum bulunamadı');
    }

    return comment;
};


export const createComment = async (
    data: {
        title?: string;
        rating: number;
        comment: string;
        productId: number;
        orderId?: number;
        orderItemId?: number;
    },
    userId: number
) => {
    const product = await prisma.product.findUnique({
        where: { id: data.productId },
    });

    if (!product) {
        throw new NotFoundError('Ürün bulunamadı');
    }

    if (!product.isActive) {
        throw new BadRequestError('Pasif bir ürüne yorum yapılamaz');
    }

    // Kullanıcının bu ürünü satın alıp almadığını kontrol et
    const deliveredOrder = await prisma.order.findFirst({
        where: {
            userId,
            status: 'DELIVERED',
            items: {
                some: {
                    productId: data.productId,
                },
            },
        },
        include: {
            items: {
                where: {
                    productId: data.productId,
                },
                select: {
                    id: true,
                },
            },
        },
    });

    if (!deliveredOrder) {
        throw new BadRequestError('Bu ürün için yorum yapabilmek için önce satın almanız ve siparişinizin teslim edilmesi gerekmektedir.');
    }

    const existingComment = await prisma.productComment.findFirst({
        where: {
            userId,
            productId: data.productId,
        },
    });

    if (existingComment) {
        throw new BadRequestError('Bu ürüne zaten yorum yaptınız. Yorumunuzu güncelleyebilirsiniz.');
    }

    const orderId = data.orderId || deliveredOrder.id;
    const orderItemId = data.orderItemId || deliveredOrder.items[0]?.id;

    const comment = await prisma.productComment.create({
        data: {
            title: data.title,
            rating: data.rating,
            comment: data.comment,
            productId: data.productId,
            userId,
            orderId,
            orderItemId,
            isApproved: false,
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    return comment;
};

export const updateComment = async (
    id: number,
    data: {
        title?: string;
        rating?: number;
        comment?: string;
    },
    userId: number
) => {
    const existingComment = await getCommentById(id);

    if (existingComment.userId !== userId) {
        throw new UnauthorizedError('Bu yorumu güncelleme yetkiniz yok');
    }

    const comment = await prisma.productComment.update({
        where: { id },
        data: {
            ...data,
            isApproved: false,
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    return comment;
};

export const deleteComment = async (id: number, userId: number, isAdmin: boolean = false) => {
    const existingComment = await getCommentById(id);

    if (!isAdmin && existingComment.userId !== userId) {
        throw new UnauthorizedError('Bu yorumu silme yetkiniz yok');
    }

    const comment = await prisma.productComment.delete({
        where: { id },
    });

    return comment;
};

export const approveComment = async (id: number, isApproved: boolean) => {
    await getCommentById(id);

    const comment = await prisma.productComment.update({
        where: { id },
        data: { isApproved },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    return comment;
};