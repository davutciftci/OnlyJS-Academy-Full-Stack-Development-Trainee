import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import Navbar from './Navbar';
import { useCart } from '../../context/CartContext';
import CartSidepanel from '../cart/CartSidepanel';
import ScrollToTop from '../ScrollToTop';
import ScrollToTopButton from '../ScrollToTopButton';

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
    </div>
);

export default function AuthLayout() {
    const { showAlert } = useCart();

    return (
        <>
            <ScrollToTop />
            <ScrollToTopButton />
            {showAlert && (
                <div className="fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
                    ✓ Sepete eklendi
                </div>
            )}
            <div className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <main className="flex-1">
                    <Suspense fallback={<PageLoader />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
            <CartSidepanel />
        </>
    );
}
