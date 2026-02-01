import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiClient } from '../api/client';
import type { CartUIItem, CartItem } from '../types/cart';

interface CartContextType {
    items: CartUIItem[];
    isOpen: boolean;
    showAlert: boolean;
    addToCart: (item: Omit<CartUIItem, 'quantity' | 'cartItemId'>, quantity?: number) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    openCart: () => void;
    closeCart: () => void;
    clearCart: () => void;
    totalPrice: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartUIItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('authToken');
            
            if (token) {
                const response = await apiClient.get('/cart');

                const backendItems = response.data.data?.cart?.items || [];

                const formattedItems: CartUIItem[] = backendItems.map((item: CartItem) => {
                    const originalPrice = Number(item.variant.price);
                    const discount = item.variant.discount;
                    // Calculate discounted price if discount exists
                    const finalPrice = discount && discount > 0 
                        ? Math.round(originalPrice * (1 - discount / 100))
                        : originalPrice;

                    return {
                        id: item.variant.product.id,
                        name: item.variant.product.name,
                        description: item.variant.product.description || '',
                        price: finalPrice,
                        image: item.variant.product.photos?.[0]?.url || '/placeholder.png',
                        quantity: item.quantity,
                        aroma: item.variant.aroma,
                        size: item.variant.size || item.variantId,
                        variantId: item.variantId,
                        slug: item.variant.product.slug,
                        categorySlug: '',
                        cartItemId: item.id
                    };
                });

                setItems(formattedItems);
            } else {
                const guestCart = localStorage.getItem('guestCart');
                if (guestCart) {
                    setItems(JSON.parse(guestCart));
                }
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (newItem: Omit<CartUIItem, 'quantity' | 'cartItemId'>, quantity: number = 1) => {
        console.log('addToCart çağrıldı:', { newItem, quantity });
        try {
            const token = localStorage.getItem('authToken');


            if (!newItem.variantId) {
                console.error('variantId yok');
                return;
            }

            if (token) {
                const response = await apiClient.post('/cart/items', {
                    variantId: newItem.variantId,
                    quantity
                });
                await fetchCart();
            } else {
                const existingItemIndex = items.findIndex(item => item.variantId === newItem.variantId);
                let updatedItems: CartUIItem[];
                
                if (existingItemIndex > -1) {
                    updatedItems = [...items];
                    updatedItems[existingItemIndex].quantity += quantity;
                } else {
                    updatedItems = [...items, { ...newItem, quantity, cartItemId: Date.now() }];
                }
                
                setItems(updatedItems);
                localStorage.setItem('guestCart', JSON.stringify(updatedItems));
            }

            setIsOpen(true);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        } catch (error) {
            console.error('Cart add failed:', error);
        }
    };

    const removeFromCart = async (cartItemId: number) => {
        try {
            const token = localStorage.getItem('authToken');
            
            if (token) {
                await apiClient.delete(`/cart/items/${cartItemId}`);
                await fetchCart();
            } else {
                const updatedItems = items.filter(item => item.cartItemId !== cartItemId);
                setItems(updatedItems);
                localStorage.setItem('guestCart', JSON.stringify(updatedItems));
            }
        } catch (error) {
            console.error('Cart remove failed:', error);
        }
    };

    const updateQuantity = async (cartItemId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(cartItemId);
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            
            if (token) {
                await apiClient.put(`/cart/items/${cartItemId}`, { quantity });
                await fetchCart();
            } else {
                const updatedItems = items.map(item => 
                    item.cartItemId === cartItemId ? { ...item, quantity } : item
                );
                setItems(updatedItems);
                localStorage.setItem('guestCart', JSON.stringify(updatedItems));
            }
        } catch (error) {
            console.error('Cart update failed:', error);
        }
    };

    const clearCart = async () => {
        try {
            const token = localStorage.getItem('authToken');
            
            if (token) {
                await apiClient.delete('/cart');
            } else {
                localStorage.removeItem('guestCart');
            }
            setItems([]);
        } catch (error) {
            console.error('Cart clear failed:', error);
        }
    };

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                isOpen,
                showAlert,
                addToCart,
                removeFromCart,
                updateQuantity,
                openCart,
                closeCart,
                clearCart,
                totalPrice,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
