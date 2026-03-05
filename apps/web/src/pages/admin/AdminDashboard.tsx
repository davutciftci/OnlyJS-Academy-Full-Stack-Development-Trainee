import { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';
import { Package, FolderTree, ShoppingCart, MessageSquare, Users } from 'lucide-react';

interface DashboardStats {
    users: { total: number };
    products: { total: number; lowStock: number };
    categories: { total: number };
    comments: { total: number };
    orders: { total: number; pending: number; today: number };
    revenue: { total: string; today: string };
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await apiClient.get('/admin/stats/dashboard');
            setStats(response.data.data);
        } catch (error) {
            console.error('İstatistikler yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Toplam Ürün',
            value: stats?.products.total || 0,
            icon: Package,
            color: 'bg-blue-500',
        },
        {
            title: 'Toplam Kategori',
            value: stats?.categories.total || 0,
            icon: FolderTree,
            color: 'bg-green-500',
        },
        {
            title: 'Toplam Sipariş',
            value: stats?.orders.total || 0,
            icon: ShoppingCart,
            color: 'bg-purple-500',
        },
        {
            title: 'Toplam Yorum',
            value: stats?.comments.total || 0,
            icon: MessageSquare,
            color: 'bg-orange-500',
        },
        {
            title: 'Toplam Kullanıcı',
            value: stats?.users.total || 0,
            icon: Users,
            color: 'bg-pink-500',
        },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                                </div>
                                <div className={`${card.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Hoş Geldiniz</h2>
                <p className="text-gray-600">
                    Admin paneline hoş geldiniz. Sol menüden ürün, kategori ve sipariş yönetimi yapabilirsiniz.
                </p>
            </div>
        </div>
    );
}
