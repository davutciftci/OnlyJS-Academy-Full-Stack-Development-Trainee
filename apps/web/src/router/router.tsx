import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import Layout from '../components/layout/Layout';
import AuthLayout from '../components/layout/AuthLayout';
import AccountLayout from '../components/layout/AccountLayout';
import CheckoutLayout from '../components/layout/CheckoutLayout';
import AdminLayout from '../components/layout/AdminLayout';

const HomePage = lazy(() => import('../pages/home/HomePage'));
const AllProductsPage = lazy(() => import('../pages/products/AllProductsPage'));

const ProductDetailPage = lazy(() => import('../pages/products/ProductDetailPage'));
const ContactPage = lazy(() => import('../pages/contact/ContactPage'));
const ReviewsPage = lazy(() => import('../pages/reviews/ReviewsPage'));
const FAQPage = lazy(() => import('../pages/faq/FAQPage'));
const BlogPage = lazy(() => import('../pages/blog/BlogPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('../pages/auth/VerifyEmailPage'));
const AccountPage = lazy(() => import('../pages/account/AccountPage'));
const OrderDetailPage = lazy(() => import('../pages/orders/OrderDetailPage'));
const OrderSuccessPage = lazy(() => import('../pages/orders/OrderSuccessPage'));
const AboutPage = lazy(() => import('../pages/about/AboutPage'));
const SalesAgreementPage = lazy(() => import('../pages/policies/SalesAgreementPage'));
const RefundPolicyPage = lazy(() => import('../pages/policies/RefundPolicyPage'));
const WorkPrinciplesPage = lazy(() => import('../pages/policies/WorkPrinciplesPage'));
const KVKKPage = lazy(() => import('../pages/policies/KVKKPage'));

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const ProductManagement = lazy(() => import('../pages/admin/ProductManagement'));
const CategoryManagement = lazy(() => import('../pages/admin/CategoryManagement'));
const ProductCreatePage = lazy(() => import('../pages/admin/ProductCreatePage'));
const ProductEditPage = lazy(() => import('../pages/admin/ProductEditPage'));
const OrderManagement = lazy(() => import('../pages/admin/OrderManagement'));
const CommentManagement = lazy(() => import('../pages/admin/CommentManagement'));
const ShippingManagement = lazy(() => import('../pages/admin/ShippingManagement'));


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'urun/:category/:slug',
                element: <ProductDetailPage />,
            },
            {
                path: 'urun/:slug',
                element: <ProductDetailPage />,
            },
            {
                path: 'urunler',
                element: <AllProductsPage />,
            },
            {
                path: 'iletisim',
                element: <ContactPage />,
            },
            {
                path: 'yorumlar',
                element: <ReviewsPage />,
            },
            {
                path: 'S.S.S',
                element: <FAQPage />,
            },
            {
                path: 'hakkimizda',
                element: <AboutPage />,
            },
            {
                path: 'sozlesme',
                element: <SalesAgreementPage />,
            },
            {
                path: 'iade',
                element: <RefundPolicyPage />,
            },
            {
                path: 'ilkelerimiz',
                element: <WorkPrinciplesPage />,
            },
            {
                path: 'kvkk',
                element: <KVKKPage />,
            },
            {
                path: 'blog',
                element: <BlogPage />,
            }
        ]
    },
    {
        path: '/giris',
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <LoginPage />,
            }
        ]
    },
    {
        path: '/kayit',
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <RegisterPage />,
            }
        ]
    },
    {
        path: '/sifremi-unuttum',
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <ForgotPasswordPage />,
            }
        ]
    },
    {
        path: '/sifre-sifirla',
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <ResetPasswordPage />,
            }
        ]
    },
    {
        path: '/dogrula',
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <VerifyEmailPage />,
            }
        ]
    },
    {
        path: '/hesabim',
        element: <AccountLayout />,
        children: [
            {
                index: true,
                element: <AccountPage />,
            }
        ]
    },
    {
        path: '/siparis/:orderId',
        element: <AccountLayout />,
        children: [
            {
                index: true,
                element: <OrderDetailPage />,
            }
        ]
    },
    {
        path: '/siparis-basarili/:orderId',
        element: <OrderSuccessPage />,
    },
    {
        path: '/odeme',
        element: <CheckoutLayout />,
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <AdminDashboard />,
            },
            {
                path: 'products',
                element: <ProductManagement />,
            },
            {
                path: 'products/new',
                element: <ProductCreatePage />,
            },
            {
                path: 'products/:id/edit',
                element: <ProductEditPage />,
            },
            {
                path: 'categories',
                element: <CategoryManagement />,
            },
            {
                path: 'orders',
                element: <OrderManagement />,
            },
            {
                path: 'comments',
                element: <CommentManagement />,
            },
            {
                path: 'shipping',
                element: <ShippingManagement />,
            },
        ]
    }
]);

