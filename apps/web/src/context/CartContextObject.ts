import { createContext } from 'react';
import type { CartUIItem } from '../types/cart';

export interface CartContextType {
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

export const CartContext = createContext<CartContextType | undefined>(undefined);
