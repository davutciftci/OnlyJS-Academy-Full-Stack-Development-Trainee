/* eslint-disable react-refresh/only-export-components */
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import type { ReactElement } from 'react';


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


const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </BrowserRouter>
    ),
    ...options,
  });

export * from '@testing-library/react';
export { customRender as render };
