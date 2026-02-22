import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

// Mock veriler
export const mockUser = {
  id: '1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  role: 'customer',
};

export const mockProduct = {
  id: 'p1',
  name: 'Test Protein',
  slug: 'test-protein',
  price: 100,
  discountedPrice: 80,
  image: '/test.jpg',
  description: 'Test açıklama',
};

// Tüm provider'ları içeren sarmalayıcı
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// testing-library/react'ten gelen her şeyi dışa aktar (render hariç)
export * from '@testing-library/react';
// default render yerine customRender'ı dışa aktar
export { customRender as render };
