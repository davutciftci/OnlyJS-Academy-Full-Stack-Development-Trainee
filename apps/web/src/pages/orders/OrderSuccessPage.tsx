import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

interface OrderItem {
    productName: string;
    variantName: string;
    quantity: number;
    price: number;
    subtotal: number;
}

interface Order {
    id: number;
    orderNumber: string;
    totalAmount: number;
    subtotal: number;
    shippingCost: number;
    taxAmount: number;
    createdAt: string;
    items: OrderItem[];
}

export default function OrderSuccessPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await apiClient.get(`/orders/${orderId}`);
                setOrder(response.data.data);
            } catch (error) {
                console.error('Sipariş yüklenemedi:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        } else {
            navigate('/');
        }
    }, [orderId, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-12 h-12 text-green-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
                    Siparişiniz Alındı!
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Sipariş numaranız: <strong>{order.orderNumber}</strong>
                </p>

                <div className="border-t border-b border-gray-200 py-6 mb-6">
                    <h2 className="font-bold text-lg mb-4">Sipariş Özeti</h2>
                    <div className="space-y-3">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                    {item.productName} - {item.variantName} <span className="text-gray-500">x{item.quantity}</span>
                                </span>
                                <span className="font-medium text-gray-900">{item.subtotal.toLocaleString('tr-TR')} TL</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Ara Toplam</span>
                            <span>{order.subtotal.toLocaleString('tr-TR')} TL</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Kargo</span>
                            <span>{order.shippingCost.toLocaleString('tr-TR')} TL</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Toplam</span>
                            <span>{order.totalAmount.toLocaleString('tr-TR')} TL</span>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                        📧 Sipariş onay maili <strong>{user?.email}</strong> adresinize gönderildi.
                    </p>
                    <p className="text-sm text-blue-800 mt-2">
                        📦 Siparişiniz hazırlandıktan sonra kargo bilgileri tarafınıza iletilecektir.
                    </p>
                </div>


                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/hesabim?tab=orders"
                        className="flex-1 bg-gray-900 text-white text-center py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        Siparişlerimi Gör
                    </Link>
                    <Link
                        to="/"
                        className="flex-1 border border-gray-300 text-gray-700 text-center py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Alışverişe Devam Et
                    </Link>
                </div>
            </div>
        </div>
    );
}
