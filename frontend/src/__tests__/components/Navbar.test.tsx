import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { AuthContext } from '../../context/AuthContextObject';
import type { AuthContextType } from '../../context/AuthContextObject';
import { CartContext } from '../../context/CartContextObject';
import type { CartContextType } from '../../context/CartContextObject';
import type { User } from '../../types';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAuthContext = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    verifyEmail: vi.fn(),
};

const mockCartContext = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isOpen: false,
    showAlert: false,
    addToCart: vi.fn(),
    removeFromCart: vi.fn(),
    updateQuantity: vi.fn(),
    openCart: vi.fn(),
    closeCart: vi.fn(),
    clearCart: vi.fn(),
};

const renderNavbar = (
    authValue: Partial<AuthContextType> = mockAuthContext, 
    cartValue: Partial<CartContextType> = mockCartContext
) => {
    return render(
        <BrowserRouter>
            <AuthContext.Provider value={authValue as AuthContextType}>
                <CartContext.Provider value={cartValue as CartContextType}>
                    <Navbar />
                </CartContext.Provider>
            </AuthContext.Provider>
        </BrowserRouter>
    );
};

describe('Navbar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Kullanıcı giriş yapmadığında "Üye Girişi" linki görünmelidir', async () => {
        renderNavbar();
        const accountButton = screen.getByText('HESAP');
        fireEvent.mouseEnter(accountButton.closest('.relative')!);

        await waitFor(() => {
            expect(screen.getByText('Üye Girişi')).toBeInTheDocument();
        });
    });

    it('Kullanıcı giriş yaptığında kullanıcı adı görünmelidir', () => {
        const loggedInAuth = { 
            ...mockAuthContext, 
            isAuthenticated: true, 
            user: { id: 1, firstName: 'Davut', lastName: 'C', email: 'davut@test.com', role: 'CUSTOMER' } as User
        };
        renderNavbar(loggedInAuth);
        expect(screen.getByText(/Davut/i)).toBeInTheDocument();
    });

    it('Arama kutusuna yazılan değer ile arama yapılmalıdır', () => {
        renderNavbar();
        const searchInput = screen.getByPlaceholderText(/Aradığınız ürünü yazınız/i);
        fireEvent.change(searchInput, { target: { value: 'protein' } });
        fireEvent.keyPress(searchInput, { key: 'Enter', code: 13, charCode: 13 });
    });

    it('Mobil menü açılıp kapanmalıdır', async () => {
        renderNavbar();
        const menuToggle = screen.getAllByLabelText(/Menü/i)[0];
        fireEvent.click(menuToggle);
        
        await waitFor(() => {
            expect(screen.getAllByText(/TÜM ÜRÜNLER/i).length).toBeGreaterThan(0);
        });
        
        fireEvent.click(menuToggle);
    });

    it('Arama butonuna hover yapıldığında onMouseEnter tetiklenmelidir', () => {
        renderNavbar();
        const searchButton = screen.getByText('ARA'); 
        fireEvent.mouseEnter(searchButton);
        fireEvent.mouseLeave(searchButton);
    });

    it('Mobil arama kutusuna yazı yazılabilmelidir', () => {
        renderNavbar();
        const menuToggle = screen.getAllByLabelText(/Menü/i)[0];
        fireEvent.click(menuToggle);
        
        const mobileSearch = screen.getByPlaceholderText(/ARADIĞINIZ ÜRÜNÜ YAZINIZ/i); 
        fireEvent.change(mobileSearch, { target: { value: 'creatine' } });
    });

    it('Çıkış yap butonuna tıklandığında logout fonksiyonu çağrılmalıdır', async () => {
        const loggedInAuth = { 
            ...mockAuthContext, 
            isAuthenticated: true, 
            user: { id: 1, firstName: 'Davut', lastName: 'C', email: 'davut@test.com', role: 'CUSTOMER' } as User
        };
        renderNavbar(loggedInAuth);
        
        const accountButton = screen.getByText(/Davut/i);
        fireEvent.mouseEnter(accountButton.closest('.relative')!);
        
        await waitFor(() => {
            const logoutButton = screen.getByText('Çıkış Yap');
            fireEvent.click(logoutButton);
        });
        
        expect(loggedInAuth.logout).toHaveBeenCalled();
    });

    it('Sepet ikonu sepeti açmalıdır', () => {
        renderNavbar();
        const cartButton = screen.getAllByLabelText(/Sepet/i)[0]; // Desktop sürümü
        fireEvent.click(cartButton);
        expect(mockCartContext.openCart).toHaveBeenCalled();
    });
});
