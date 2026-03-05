import prisma from "../utils/prisma";
import { OrderStatus } from "../../generated/prisma";

interface DailySales {
    date: string;
    orders: number;
    revenue: string;
}

interface MonthlyRevenue {
    month: number;
    monthName: string;
    orders: number;
    revenue: string;
}


export const getDashboardStats = async () => {
    const [
        totalUsers,
        totalProducts,
        totalOrders,
        totalCategories,
        totalComments,
        pendingOrders,
        totalRevenue,
        todayOrders,
        todayRevenue,
        lowStockProducts,
    ] = await Promise.all([
        prisma.user.count(),

        prisma.product.count({ where: { isActive: true } }),

        prisma.order.count(),

        prisma.category.count(),

        prisma.productComment.count(),

        prisma.order.count({ where: { status: OrderStatus.PENDING } }),

        prisma.order.aggregate({
            where: {
                status: {
                    in: [OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
                },
            },
            _sum: {
                totalAmount: true,
            },
        }),

        prisma.order.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        }),

        prisma.order.aggregate({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
                status: {
                    in: [OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
                },
            },
            _sum: {
                totalAmount: true,
            },
        }),

        prisma.productVariant.count({
            where: {
                stockCount: {
                    lt: 10,
                },
                isActive: true,
            },
        }),
    ]);

    return {
        users: {
            total: totalUsers,
        },
        products: {
            total: totalProducts,
            lowStock: lowStockProducts,
        },
        categories: {
            total: totalCategories,
        },
        comments: {
            total: totalComments,
        },
        orders: {
            total: totalOrders,
            pending: pendingOrders,
            today: todayOrders,
        },
        revenue: {
            total: Number(totalRevenue._sum.totalAmount || 0).toFixed(2),
            today: Number(todayRevenue._sum.totalAmount || 0).toFixed(2),
        },
    };
};


export const getOrderStatusStats = async () => {
    const statusCounts = await prisma.order.groupBy({
        by: ['status'],
        _count: {
            id: true,
        },
    });

    const stats = statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
    }, {} as Record<string, number>);

    return stats;
};

export const getLast7DaysSales = async () => {
    const last7Days: DailySales[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const [orderCount, revenue] = await Promise.all([
            prisma.order.count({
                where: {
                    createdAt: {
                        gte: date,
                        lt: nextDate,
                    },
                },
            }),

            prisma.order.aggregate({
                where: {
                    createdAt: {
                        gte: date,
                        lt: nextDate,
                    },
                    status: {
                        in: [OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
                    },
                },
                _sum: {
                    totalAmount: true,
                },
            }),
        ]);

        last7Days.push({
            date: date.toISOString().split('T')[0],
            orders: orderCount,
            revenue: Number(revenue._sum.totalAmount || 0).toFixed(2),
        });
    }

    return last7Days;
};


export const getTopSellingProducts = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const totalItems = await prisma.orderItem.groupBy({
        by: ['variantId'],
        _sum: {
            quantity: true,
        },
    });

    const totalCount = totalItems.length;
    const totalPages = Math.ceil(totalCount / limit);

    const topProducts = await prisma.orderItem.groupBy({
        by: ['variantId'],
        _sum: {
            quantity: true,
            subtotal: true,
        },
        orderBy: {
            _sum: {
                quantity: 'desc',
            },
        },
        skip,
        take: limit,
    });

    const productsWithDetails = await Promise.all(
        topProducts.map(async (item) => {
            const variant = await prisma.productVariant.findUnique({
                where: { id: item.variantId },
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            });

            return {
                variantId: item.variantId,
                productName: variant?.product.name || 'Bilinmeyen',
                variantName: variant?.name || 'Bilinmeyen',
                totalSold: item._sum.quantity || 0,
                totalRevenue: Number(item._sum.subtotal || 0).toFixed(2),
            };
        })
    );

    return {
        products: productsWithDetails,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: totalCount,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        }
    };
};
export const getRecentUsers = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;

    const totalUsers = await prisma.user.count();
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await prisma.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        skip,
        take: limit,
    });

    return {
        users,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: totalUsers,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        }
    };
};

export const getLowStockProducts = async (page: number = 1, limit: number = 10, threshold: number = 10) => {
    const skip = (page - 1) * limit;

    const totalItems = await prisma.productVariant.count({
        where: {
            stockCount: {
                lt: threshold,
            },
            isActive: true,
        },
    });

    const totalPages = Math.ceil(totalItems / limit);

    const lowStockVariants = await prisma.productVariant.findMany({
        where: {
            stockCount: {
                lt: threshold,
            },
            isActive: true,
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
        orderBy: {
            stockCount: 'asc',
        },
        skip,
        take: limit,
    });

    const formatted = lowStockVariants.map(v => ({
        variantId: v.id,
        productName: v.product.name,
        variantName: v.name,
        sku: v.sku,
        stockCount: v.stockCount,
        price: Number(v.price).toFixed(2),
    }));

    return {
        products: formatted,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        }
    };
};


export const getProductsByCategory = async () => {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: {
                    Product: true,
                },
            },
        },
    });

    const formatted = categories
        .map(c => ({
            categoryId: c.id,
            categoryName: c.name,
            productCount: (c as typeof c & { _count: { Product: number } })._count.Product,
        }))
        .sort((a, b) => b.productCount - a.productCount);

    return formatted;
};

export const getMonthlyRevenue = async (year?: number) => {
    const targetYear = year || new Date().getFullYear();

    const monthlyData: MonthlyRevenue[] = [];

    for (let month = 0; month < 12; month++) {
        const startDate = new Date(targetYear, month, 1);
        const endDate = new Date(targetYear, month + 1, 1);

        const revenue = await prisma.order.aggregate({
            where: {
                createdAt: {
                    gte: startDate,
                    lt: endDate,
                },
                status: {
                    in: [OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
                },
            },
            _sum: {
                totalAmount: true,
            },
            _count: {
                id: true,
            },
        });

        monthlyData.push({
            month: month + 1,
            monthName: new Date(targetYear, month).toLocaleString('tr-TR', { month: 'long' }),
            orders: revenue._count.id,
            revenue: Number(revenue._sum.totalAmount || 0).toFixed(2),
        });
    }

    return monthlyData;
};