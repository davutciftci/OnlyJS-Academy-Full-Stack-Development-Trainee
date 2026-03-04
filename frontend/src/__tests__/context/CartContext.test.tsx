import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../../context/CartContext';
import { AuthProvider } from '../../context/AuthContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../../api/client';
import type { CartUIItem } from '../../types/cart';

vi.mock('../../api/client', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    }
}));

const TestComponent = () => {
    const { items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart, isOpen, openCart, closeCart } = useCart();
    return (
        <div>
            <div data-testid="total-items">{totalItems || 0}</div>
            <div data-testid="total-price">{totalPrice || 0}</div>
            <div data-testid="items-count">{items.length}</div>
            <button onClick={() => addToCart({ variantId: 101, name: 'Ürün 1', price: 100 } as CartUIItem)}>Ekle</button>
            <button onClick={() => addToCart({} as CartUIItem)}>Hatalı Ekle</button>
            <button onClick={() => {
                if (items.length > 0) removeFromCart(items[0].cartItemId);
            }}>Sil</button>
            <button onClick={() => {
                if (items.length > 0) updateQuantity(items[0].cartItemId, items[0].quantity + 1);
            }}>Artır</button>
            <button onClick={openCart}>Aç</button>
            <button onClick={closeCart}>Kapat</button>
            <button onClick={clearCart}>Temizle</button>
            {isOpen && <div data-testid="cart-open">Açık</div>}
        </div>
    );
};

describe('CartContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('Başlangıçta sepet boş olmalıdır', () => {
        render(<AuthProvider><CartProvider><TestComponent /></CartProvider></AuthProvider>);
        expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    });

    it('Misafir modunda addToCart localstorage kullanmalıdır', async () => {
        render(<AuthProvider><CartProvider><TestComponent /></CartProvider></AuthProvider>);
        fireEvent.click(screen.getByText('Ekle'));
        await waitFor(() => {
            const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            expect(guestCart.length).toBe(1);
            expect(screen.getByTestId('items-count')).toHaveTextContent('1');
        });
    });

    it('Misafir modunda removeFromCart localstorage kullanmalıdır', async () => {
        const initialItems = [{ variantId: 101, name: 'X', price: 10, quantity: 1, cartItemId: 123 }];
        localStorage.setItem('guestCart', JSON.stringify(initialItems));
        render(<AuthProvider><CartProvider><TestComponent /></CartProvider></AuthProvider>);
        await waitFor(() => expect(screen.getByTestId('items-count')).toHaveTextContent('1'));
        fireEvent.click(screen.getByText('Sil'));
        await waitFor(() => expect(screen.getByTestId('items-count')).toHaveTextContent('0'));
    });

    it('Misafir modunda updateQuantity localstorage kullanmalıdır', async () => {
        const initialItems = [{ variantId: 101, name: 'X', price: 10, quantity: 1, cartItemId: 123 }];
        localStorage.setItem('guestCart', JSON.stringify(initialItems));
        render(<AuthProvider><CartProvider><TestComponent /></CartProvider></AuthProvider>);
        await waitFor(() => expect(screen.getByTestId('items-count')).toHaveTextContent('1'));
        fireEvent.click(screen.getByText('Artır'));
        await waitFor(() => {
            const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            expect(guestCart[0].quantity).toBe(2);
        });
    });

    it('Misafir modunda clearCart localstorage kullanmalıdır', async () => {
        localStorage.setItem('guestCart', JSON.stringify([{ id: 1 }]));
        render(<AuthProvider><CartProvider><TestComponent /></CartProvider></AuthProvider>);
        fireEvent.click(screen.getByText('Temizle'));
        await waitFor(() => expect(localStorage.getItem('guestCart')).toBeNull());
    });

    it('fetchCart hatası konsola yazılmalıdır', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        localStorage.setItem('authToken', 'token');
        vi.mocked(apiClient.get).mockRejectedValue(new Error('Fetch error'));
        render(<AuthProvider><CartProvider><TestComponent /></CartProvider></AuthProvider>);
        await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch cart:', expect.any(Error)));
        consoleSpy.mockRestore();
    });

    it('addToCart hatası konsola yazılmalıdır', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        localStorage.setItem('authToken', 'token');
        vi.mocked(apiClient.post).mockRejectedValue(new Error('Post error'));
        render(<AuthProvider><CartProvider><TestComponent /></CartProvider></AuthProvider>);
        fireEvent.click(screen.getByText('Ekle'));
        await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Cart add failed:', expect.any(Error)));
        consoleSpy.mockRestore();
    });

    it('removeFromCart hatası konsola yazılmalıdır', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        localStorage.setItem('authToken', 'token');
        vi.mocked(apiClient.get).mockResolvedValue({
            data: { data: { cart: { items: [{ id: 1, quantity: 1, variantId: 1, variant: { price: 10, product: { name: 'X' } } }] } } }
        });
        render(<AuthProvider><CartProvider><TestComponent /></CartProvider></AuthProvider>);
        await waitFor(() => expect(screen.getByTestId('items-count')).toHaveTextContent('1'));
        vi.mocked(apiClient.delete).mockRejectedValue(new Error('Delete error'));
        fireEvent.click(screen.getByText('Sil'));
        await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Cart remove failed:', expect.any(Error)));
        consoleSpy.mockRestore();
    });

    it('updateQuantity hatası konsola yazılmalıdır', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        localStorage.setItem('authToken', 'token');
        vi.mocked(apiClient.get).mockResolvedValue({
            data: { data: { cart: { items: [{ id: 1, quantity: 1, variantId: 1, variant: { price: 10, product: { name: 'X' } } }] } } }
        });
        render(<AuthProvider><CartProvider><TestComponent /></CartProvider></AuthProvider>);
        await waitFor(() => expect(screen.getByTestId('items-count')).toHaveTextContent('1'));
        vi.mocked(apiClient.put).mockRejectedValue(new Error('Put error'));
        fireEvent.click(screen.getByText('Artır'));
        await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Cart update failed:', expect.any(Error)));
        consoleSpy.mockRestore();
    });

    it('clearCart hatası konsola yazılmalıdır', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        localStorage.setItem('authToken', 'token');
        render(<AuthProvider><CartProvider><TestComponent /></CartProvider></AuthProvider>);
        vi.mocked(apiClient.delete).mockRejectedValue(new Error('Clear error'));
        fireEvent.click(screen.getByText('Temizle'));
        await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Cart clear failed:', expect.any(Error)));
        consoleSpy.mockRestore();
    });

    it('variantId yoksa hata konsola yazılmalıdır', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(<AuthProvider><CartProvider><TestComponent /></CartProvider></AuthProvider>);
        fireEvent.click(screen.getByText('Hatalı Ekle'));
        expect(consoleSpy).toHaveBeenCalledWith('variantId yok');
        consoleSpy.mockRestore();
    });

    it('openCart ve closeCart isOpen durumunu değiştirmelidir', () => {
        render(<AuthProvider><CartProvider><TestComponent /></CartProvider></AuthProvider>);
        expect(screen.queryByTestId('cart-open')).toBeNull();
        fireEvent.click(screen.getByText('Aç'));
        expect(screen.getByTestId('cart-open')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Kapat'));
        expect(screen.queryByTestId('cart-open')).toBeNull();
    });

    it('useCart context dışında kullanıldığında hata fırlatmalıdır', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const BuggyComponent = () => {
            useCart();
            return null;
        };
        expect(() => render(<BuggyComponent />)).toThrow('useCart must be used within a CartProvider');
        consoleSpy.mockRestore();
    });

    it('updateQuantity 0 ise removeFromCart çağırmalıdır', async () => {
        const initialItems = [{ variantId: 101, name: 'X', price: 10, quantity: 1, cartItemId: 123 }];
        localStorage.setItem('guestCart', JSON.stringify(initialItems));
        render(<AuthProvider><CartProvider><TestComponent /></CartProvider></AuthProvider>);
        
        const TestZeroQty = () => {
            const { items, updateQuantity } = useCart();
            return <button onClick={() => updateQuantity(items[0].cartItemId, 0)}>Sıfırla</button>;
        };
        render(<AuthProvider><CartProvider><TestZeroQty /></CartProvider></AuthProvider>);
        await screen.findByText('Sıfırla');
        fireEvent.click(screen.getByText('Sıfırla'));
        await waitFor(() => {
            const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
            expect(guestCart.length).toBe(0);
        });
    });
});
