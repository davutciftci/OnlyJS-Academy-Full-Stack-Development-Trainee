import { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface ShippingMethod {
    id: number;
    name: string;
    code: string;
    price: number;
    deliveryDays: string;
    description: string | null;
    isActive: boolean;
}

export default function ShippingManagement() {
    const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingMethod, setEditingMethod] = useState<Partial<ShippingMethod> | null>(null);

    useEffect(() => {
        fetchShippingMethods();
    }, []);

    const fetchShippingMethods = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/shipping/admin/all');
            setShippingMethods(response.data.data);
        } catch (error) {
            console.error('Kargo yöntemleri yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setEditingMethod({
            name: '',
            code: '',
            price: 0,
            deliveryDays: '',
            description: '',
            isActive: true,
        });
        setIsEditing(true);
    };

    const handleEdit = (method: ShippingMethod) => {
        setEditingMethod(method);
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!editingMethod) return;

        try {
            if ('id' in editingMethod && editingMethod.id) {
                // Güncelleme
                await apiClient.put(`/shipping/${editingMethod.id}`, editingMethod);
            } else {
                // Yeni ekleme
                await apiClient.post('/shipping', editingMethod);
            }
            fetchShippingMethods();
            setIsEditing(false);
            setEditingMethod(null);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            console.error('Kargo yöntemi kaydedilemedi:', error);
            alert(err.response?.data?.message || 'Bir hata oluştu');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bu kargo yöntemini silmek istediğinizden emin misiniz?')) return;

        try {
            await apiClient.delete(`/shipping/${id}`);
            fetchShippingMethods();
        } catch (error) {
            console.error('Kargo yöntemi silinemedi:', error);
            alert('Kargo yöntemi silinirken bir hata oluştu');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingMethod(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Kargo Yönetimi</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Kargo Yöntemi
                </button>
            </div>

            {isEditing && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-bold mb-4">
                        {editingMethod?.id ? 'Kargo Yöntemini Düzenle' : 'Yeni Kargo Yöntemi Ekle'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kargo Adı *
                            </label>
                            <input
                                type="text"
                                value={editingMethod?.name || ''}
                                onChange={(e) =>
                                    setEditingMethod((prev) => prev ? { ...prev, name: e.target.value } : null)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Örn: Aras Kargo"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kargo Kodu *
                            </label>
                            <input
                                type="text"
                                value={editingMethod?.code || ''}
                                onChange={(e) =>
                                    setEditingMethod((prev) => prev ? { ...prev, code: e.target.value } : null)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Örn: aras"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fiyat (TL) *
                            </label>
                            <input
                                type="number"
                                value={editingMethod?.price || 0}
                                onChange={(e) =>
                                    setEditingMethod((prev) => prev ? { ...prev, price: parseFloat(e.target.value) } : null)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="0"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Teslimat Süresi *
                            </label>
                            <input
                                type="text"
                                value={editingMethod?.deliveryDays || ''}
                                onChange={(e) =>
                                    setEditingMethod((prev) => prev ? { ...prev, deliveryDays: e.target.value } : null)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                placeholder="Örn: 1-3 iş günü"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Açıklama
                            </label>
                            <textarea
                                value={editingMethod?.description || ''}
                                onChange={(e) =>
                                    setEditingMethod((prev) => prev ? { ...prev, description: e.target.value } : null)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                rows={3}
                                placeholder="Kargo yöntemi hakkında açıklama"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editingMethod?.isActive || false}
                                    onChange={(e) =>
                                        setEditingMethod((prev) => prev ? { ...prev, isActive: e.target.checked } : null)
                                    }
                                    className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Aktif</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            Kaydet
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            İptal
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {shippingMethods.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Henüz kargo yöntemi eklenmemiş.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kargo Adı
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kod
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fiyat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Teslimat Süresi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Durum
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {shippingMethods.map((method) => (
                                    <tr key={method.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {method.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{method.code}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {method.price.toLocaleString('tr-TR')} TL
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{method.deliveryDays}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {method.isActive ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                    Pasif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(method)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                    title="Düzenle"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(method.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                    title="Sil"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
