import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import './index.css'

if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  // Prevent stale production service workers from hijacking dev requests.
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister()
    })
  })
}

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <CartProvider>
            <RouterProvider router={router} />
        </CartProvider>
    </AuthProvider>
)


