import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <CartProvider>
            <RouterProvider router={router} />
        </CartProvider>
    </AuthProvider>
)


