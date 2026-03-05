/// <reference types="jest" />




jest.mock('../src/utils/prisma', () => ({
    __esModule: true,
    default: {
        cart: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        cartItem: {
            findUnique: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
        },
        productVariant: {
            findUnique: jest.fn(),
        },
    },
}));


const prismaMock = (require('../src/utils/prisma').default) as {
    cart: { findUnique: jest.Mock; create: jest.Mock };
    cartItem: {
        findUnique: jest.Mock;
        update: jest.Mock;
        create: jest.Mock;
        delete: jest.Mock;
        deleteMany: jest.Mock;
    };
    productVariant: { findUnique: jest.Mock };
};


const {
    getOrCreateCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
} = require('../src/services/cart') as typeof import('../src/services/cart');


const { NotFoundError, BadRequestError } =
    require('../src/utils/customErrors') as typeof import('../src/utils/customErrors');

describe('Cart Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    describe('getOrCreateCart', () => {
        it('returns an existing cart when found', async () => {
            const cart = { id: 1, userId: 1, items: [] };
            prismaMock.cart.findUnique.mockResolvedValue(cart);

            const result = await getOrCreateCart(1);

            expect(prismaMock.cart.findUnique).toHaveBeenCalledWith(
                expect.objectContaining({ where: { userId: 1 } })
            );
            expect(result).toEqual(cart);
            expect(prismaMock.cart.create).not.toHaveBeenCalled();
        });

        it('creates and returns a new cart when none exists', async () => {
            const newCart = { id: 2, userId: 2, items: [] };
            prismaMock.cart.findUnique.mockResolvedValue(null);
            prismaMock.cart.create.mockResolvedValue(newCart);

            const result = await getOrCreateCart(2);

            expect(prismaMock.cart.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: { userId: 2 } })
            );
            expect(result).toEqual(newCart);
        });
    });


    describe('addToCart', () => {
        it('throws NotFoundError when the variant does not exist', async () => {
            prismaMock.productVariant.findUnique.mockResolvedValue(null);

            await expect(addToCart(1, 999, 1)).rejects.toThrow(NotFoundError);
            await expect(addToCart(1, 999, 1)).rejects.toThrow('Ürün varyantı bulunamadı');
        });

        it('throws BadRequestError when the variant is inactive', async () => {
            prismaMock.productVariant.findUnique.mockResolvedValue({
                isActive: false, stockCount: 10, product: { id: 10, isActive: true },
            });

            await expect(addToCart(1, 1, 1)).rejects.toThrow(BadRequestError);
            await expect(addToCart(1, 1, 1)).rejects.toThrow('Bu ürün şu an satışta değil');
        });

        it('throws BadRequestError when the product is inactive', async () => {
            prismaMock.productVariant.findUnique.mockResolvedValue({
                isActive: true, stockCount: 10, product: { id: 10, isActive: false },
            });

            await expect(addToCart(1, 1, 1)).rejects.toThrow(BadRequestError);
        });

        it('throws BadRequestError when requested quantity exceeds stock', async () => {
            prismaMock.productVariant.findUnique.mockResolvedValue({
                isActive: true, stockCount: 0, product: { id: 10, isActive: true },
            });

            await expect(addToCart(1, 1, 1)).rejects.toThrow(BadRequestError);
            await expect(addToCart(1, 1, 1)).rejects.toThrow('Yetersiz stok');
        });

        it('updates quantity when the item is already in the cart', async () => {
            prismaMock.productVariant.findUnique.mockResolvedValue({
                id: 1, isActive: true, stockCount: 10, product: { id: 10, isActive: true },
            });
            prismaMock.cart.findUnique.mockResolvedValue({ id: 5, userId: 1, items: [] });
            prismaMock.cartItem.findUnique.mockResolvedValue({ id: 20, cartId: 5, variantId: 1, quantity: 2 });
            prismaMock.cartItem.update.mockResolvedValue({});

            await addToCart(1, 1, 3);

            expect(prismaMock.cartItem.update).toHaveBeenCalledWith({
                where: { id: 20 },
                data: { quantity: 5 },
            });
        });

        it('throws BadRequestError when updated quantity would exceed stock', async () => {
            prismaMock.productVariant.findUnique.mockResolvedValue({
                id: 1, isActive: true, stockCount: 4, product: { id: 10, isActive: true },
            });
            prismaMock.cart.findUnique.mockResolvedValue({ id: 5, userId: 1, items: [] });
            prismaMock.cartItem.findUnique.mockResolvedValue({ id: 20, cartId: 5, variantId: 1, quantity: 2 });

            await expect(addToCart(1, 1, 3)).rejects.toThrow(BadRequestError);
            await expect(addToCart(1, 1, 3)).rejects.toThrow('Yetersiz stok');
        });

        it('creates a new cart item when the variant is not yet in the cart', async () => {
            prismaMock.productVariant.findUnique.mockResolvedValue({
                id: 1, isActive: true, stockCount: 10, product: { id: 10, isActive: true },
            });
            prismaMock.cart.findUnique.mockResolvedValue({ id: 5, userId: 1, items: [] });
            prismaMock.cartItem.findUnique.mockResolvedValue(null);
            prismaMock.cartItem.create.mockResolvedValue({});

            await addToCart(1, 1, 3);

            expect(prismaMock.cartItem.create).toHaveBeenCalledWith({
                data: { cartId: 5, variantId: 1, productId: 10, quantity: 3 },
            });
        });
    });


    describe('updateCartItemQuantity', () => {
        it('throws NotFoundError when the cart item does not exist', async () => {
            prismaMock.cartItem.findUnique.mockResolvedValue(null);

            await expect(updateCartItemQuantity(1, 10, 2)).rejects.toThrow(NotFoundError);
        });

        it('throws BadRequestError when the cart belongs to another user', async () => {
            prismaMock.cartItem.findUnique.mockResolvedValue({ id: 10, cart: { userId: 99 }, variant: { stockCount: 10 } });

            await expect(updateCartItemQuantity(1, 10, 2)).rejects.toThrow(BadRequestError);
            await expect(updateCartItemQuantity(1, 10, 2)).rejects.toThrow('Bu sepet size ait değil');
        });

        it('throws BadRequestError when requested quantity exceeds stock', async () => {
            prismaMock.cartItem.findUnique.mockResolvedValue({ id: 10, cart: { userId: 1 }, variant: { stockCount: 1 } });

            await expect(updateCartItemQuantity(1, 10, 5)).rejects.toThrow(BadRequestError);
        });

        it('updates quantity when all validations pass', async () => {
            prismaMock.cartItem.findUnique.mockResolvedValue({ id: 10, cart: { userId: 1 }, variant: { stockCount: 10 } });
            prismaMock.cartItem.update.mockResolvedValue({});
            prismaMock.cart.findUnique.mockResolvedValue({ id: 5, userId: 1, items: [] });

            await updateCartItemQuantity(1, 10, 5);

            expect(prismaMock.cartItem.update).toHaveBeenCalledWith({
                where: { id: 10 },
                data: { quantity: 5 },
            });
        });
    });


    describe('removeFromCart', () => {
        it('throws NotFoundError when the cart item does not exist', async () => {
            prismaMock.cartItem.findUnique.mockResolvedValue(null);

            await expect(removeFromCart(1, 10)).rejects.toThrow(NotFoundError);
        });

        it('throws BadRequestError when the cart belongs to another user', async () => {
            prismaMock.cartItem.findUnique.mockResolvedValue({ id: 10, cart: { userId: 99 } });

            await expect(removeFromCart(1, 10)).rejects.toThrow(BadRequestError);
        });

        it('deletes the cart item when the item belongs to the user', async () => {
            prismaMock.cartItem.findUnique.mockResolvedValue({ id: 10, cart: { userId: 1 } });
            prismaMock.cartItem.delete.mockResolvedValue({});
            prismaMock.cart.findUnique.mockResolvedValue({ id: 5, userId: 1, items: [] });

            await removeFromCart(1, 10);

            expect(prismaMock.cartItem.delete).toHaveBeenCalledWith({ where: { id: 10 } });
        });
    });


    describe('clearCart', () => {
        it('deletes all items from the users cart', async () => {
            prismaMock.cart.findUnique.mockResolvedValue({ id: 5, userId: 1, items: [] });
            prismaMock.cartItem.deleteMany.mockResolvedValue({});

            await clearCart(1);

            expect(prismaMock.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: 5 } });
        });

        it('creates a cart first if one does not exist, then clears it', async () => {
            prismaMock.cart.findUnique
                .mockResolvedValueOnce(null) // first call: getOrCreateCart returns null
                .mockResolvedValue({ id: 9, userId: 3, items: [] }); // second call: after create
            prismaMock.cart.create.mockResolvedValue({ id: 9, userId: 3, items: [] });
            prismaMock.cartItem.deleteMany.mockResolvedValue({});

            await clearCart(3);

            expect(prismaMock.cart.create).toHaveBeenCalled();
            expect(prismaMock.cartItem.deleteMany).toHaveBeenCalled();
        });
    });
});
