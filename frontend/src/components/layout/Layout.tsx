import { Outlet, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import FooterBanner from './FooterBanner';
import { useCart } from '../../context/CartContext';
import CartSidepanel from '../cart/CartSidepanel';
import ScrollToTop from '../ScrollToTop';
import ScrollToTopButton from '../ScrollToTopButton';

const PAGES_WITHOUT_FOOTER_BANNER = [
    '/iletisim',
    '/S.S.S',
    '/hakkimizda',
    '/sozlesme',
    '/iade',
    '/ilkelerimiz',
    '/kvkk',
    '/yorumlar'
];

// Loading fallback for lazy loaded pages
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Yükleniyor...</p>
        </div>
    </div>
);

export default function Layout() {
    const location = useLocation();
    const isProductPage = location.pathname.startsWith('/urun/');
    const hideFooterBanner = isProductPage || PAGES_WITHOUT_FOOTER_BANNER.includes(location.pathname);
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
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <Suspense fallback={<PageLoader />}>
                    <Outlet />
                </Suspense>
                {!hideFooterBanner && <FooterBanner />}
                <Footer />
            </div>
            <CartSidepanel />
        </>
    );
}
