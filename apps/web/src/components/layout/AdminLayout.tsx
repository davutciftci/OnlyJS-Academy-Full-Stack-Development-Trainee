import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, Suspense } from 'react';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingCart,
    MessageSquare,
    Truck,
    LogOut
} from 'lucide-react';

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
    </div>
);

export default function AdminLayout() {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
            navigate('/giris');
        }
    }, [isAuthenticated, isLoading, user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Yükleniyor...</p>
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== 'ADMIN') {
        return null;
    }

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: Package, label: 'Ürünler' },
        { path: '/admin/categories', icon: FolderTree, label: 'Kategoriler' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Siparişler' },
        { path: '/admin/comments', icon: MessageSquare, label: 'Ürün Yorumları' },
        { path: '/admin/shipping', icon: Truck, label: 'Kargo Bilgileri' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-black italic" style={{ fontFamily: 'Arial, sans-serif' }}>
                        OJS<br />NUTRITION
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">Admin Panel</p>
                </div>

                <nav className="p-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-red-600 hover:bg-red-50 w-full transition-colors mt-4"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Çıkış Yap</span>
                    </button>
                </nav>
            </aside>

            <div className="flex-1">
                <header className="bg-white shadow-sm p-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">
                        {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                </header>

                <main className="p-6">
                    <Suspense fallback={<PageLoader />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
        </div>
    );
}
