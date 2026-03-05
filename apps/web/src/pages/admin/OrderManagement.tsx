import { useState, useEffect } from 'react';
import { Eye, Filter } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { Order, OrderStatus } from '../../types';

const STATUS_LABELS: Record<OrderStatus, string> = {
    PENDING: 'Beklemede',
    CONFIRMED: 'Onaylandı',
    PREPARING: 'Hazırlanıyor',
    SHIPPED: 'Kargoda',
    DELIVERED: 'Teslim Edildi',
    CANCELLED: 'İptal Edildi',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-purple-100 text-purple-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
};

export default function OrderManagement() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await adminService.getOrders();
            setOrders(data);
        } catch (error) {
            console.error('Siparişler yüklenemedi:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: number, newStatus: OrderStatus) => {
        try {
            await adminService.updateOrderStatus(orderId, newStatus);
            await fetchOrders();
            if (selectedOrder && selectedOrder.id === orderId) {
                const updated = await adminService.getOrderById(orderId);
                setSelectedOrder(updated);
            }
        } catch (error) {
            console.error('Sipariş durumu güncellenemedi:', error);
            alert('Sipariş durumu güncellenirken bir hata oluştu.');
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
        const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (isLoading) {
        return <div className="text-center py-8">Yükleniyor...</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h1>
            </div>

            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div>
                        <input
                            type="text"
                            placeholder="Sipariş numarasıyla ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    
                    <div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="ALL">Tüm Durumlar</option>
                                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sipariş No
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tarih
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Toplam
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Durum
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Durum Güncelle
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                İşlemler
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{order.totalAmount} TL</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[order.status]}`}>
                                        {STATUS_LABELS[order.status]}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Detay
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Sipariş bulunamadı
                    </div>
                )}
            </div>

            
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Sipariş Detayı</h2>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">Sipariş No</p>
                                    <p className="font-semibold">{selectedOrder.orderNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tarih</p>
                                    <p className="font-semibold">
                                        {new Date(selectedOrder.createdAt).toLocaleDateString('tr-TR')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Durum</p>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[selectedOrder.status]}`}>
                                        {STATUS_LABELS[selectedOrder.status]}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Toplam</p>
                                    <p className="font-semibold">{selectedOrder.totalAmount} TL</p>
                                </div>
                            </div>

                            
                            <div className="mb-6">
                                <h3 className="font-semibold mb-2">Teslimat Adresi</h3>
                                <div className="bg-gray-50 p-4 rounded">
                                    <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.phoneNumber}</p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {selectedOrder.shippingAddress.addressLine1}
                                    </p>
                                    {selectedOrder.shippingAddress.addressLine2 && (
                                        <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.addressLine2}</p>
                                    )}
                                    <p className="text-sm text-gray-600">
                                        {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.city}
                                    </p>
                                </div>
                            </div>

                            
                            <div className="mb-6">
                                <h3 className="font-semibold mb-2">Ürünler</h3>
                                <div className="border rounded">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={item.id} className={`p-4 ${index > 0 ? 'border-t' : ''}`}>
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="font-medium">{item.productName}</p>
                                                    <p className="text-sm text-gray-500">{item.variantName}</p>
                                                    <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">{item.subtotal} TL</p>
                                                    <p className="text-sm text-gray-500">{item.price} TL/adet</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            
                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Ara Toplam</span>
                                    <span>{selectedOrder.subtotal} TL</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Kargo</span>
                                    <span>{selectedOrder.shippingCost} TL</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Vergi</span>
                                    <span>{selectedOrder.taxAmount} TL</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2">
                                    <span>Toplam</span>
                                    <span>{selectedOrder.totalAmount} TL</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
