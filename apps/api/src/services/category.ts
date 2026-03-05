import { ConflictError, NotFoundError } from "../utils/customErrors";
import prisma from "../utils/prisma";

export const getAllCategories = async (activeOnly: boolean = false) => {
    const where = activeOnly ? { isActive: true } : {};

    return await prisma.category.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    });
};

export const getCategoryById = async (id: number) => {
    const category = await prisma.category.findUnique({
        where: { id },
    });

    if (!category) {
        throw new NotFoundError('Kategori bulunamadı');
    }

    return category
}

export const createCategory = async (data: {
    name: string;
    description?: string;
    slug: string;
    isActive?: boolean
}) => {

    const existingCategory = await prisma.category.findFirst({
        where: {
            OR: [
                { name: data.name },
                { slug: data.slug }
            ]
        }
    });

    if (existingCategory) {
        if (existingCategory.name === data.name) {
            throw new ConflictError('Bu kategori adı zaten kullanılıyor')
        }
        throw new ConflictError('Bu slug zaten kullanılıyor')
    }

    return await prisma.category.create({
        data,
    });
}

export const updateCategory = async (
    id: number,
    data: {
        name?: string;
        description?: string;
        slug?: string;
        isActive?: boolean;
    }
) => {
    return await prisma.category.update({
        where: { id },
        data,
    });
}

export const deleteCategory = async (id: number) => {

    await getCategoryById(id);

    return await prisma.category.delete({
        where: { id },
    })
}