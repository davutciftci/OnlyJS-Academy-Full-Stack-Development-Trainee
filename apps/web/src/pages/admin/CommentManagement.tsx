import { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { Star, Check, X, Trash2 } from 'lucide-react';

interface ProductComment {
    id: number;
    rating: number;
    comment: string;
    isApproved: boolean;
    createdAt: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
    };
    product: {
        id: number;
        name: string;
        slug: string;
    };
}

export default function CommentManagement() {
    const [comments, setComments] = useState<ProductComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/comments/admin/all');
            setComments(response.data.data);
        } catch (error) {
            console.error('Yorumlar yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number, isApproved: boolean) => {
        try {
            await apiClient.patch(`/comments/${id}/approve`, { isApproved });
            fetchComments();
        } catch (error) {
            console.error('Yorum onaylanamadı:', error);
            alert('Yorum onaylanırken bir hata oluştu');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;

        try {
            await apiClient.delete(`/comments/${id}`);
            fetchComments();
        } catch (error) {
            console.error('Yorum silinemedi:', error);
            alert('Yorum silinirken bir hata oluştu');
        }
    };

    const filteredComments = comments.filter(comment => {
        if (filter === 'approved') return comment.isApproved;
        if (filter === 'pending') return !comment.isApproved;
        return true;
    });

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
                <h1 className="text-2xl font-bold text-gray-900">Ürün Yorumları</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === 'all'
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Tümü ({comments.length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === 'pending'
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Bekleyenler ({comments.filter(c => !c.isApproved).length})
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === 'approved'
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Onaylananlar ({comments.filter(c => c.isApproved).length})
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredComments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        {filter === 'pending' && 'Bekleyen yorum bulunmamaktadır.'}
                        {filter === 'approved' && 'Onaylanmış yorum bulunmamaktadır.'}
                        {filter === 'all' && 'Henüz yorum yapılmamış.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ürün
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kullanıcı
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Puan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Yorum
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Durum
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tarih
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredComments.map((comment) => (
                                    <tr key={comment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {comment.product.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {comment.user.firstName} {comment.user.lastName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < comment.rating
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-md truncate">
                                                {comment.comment}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {comment.isApproved ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Onaylandı
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    Bekliyor
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                {!comment.isApproved && (
                                                    <button
                                                        onClick={() => handleApprove(comment.id, true)}
                                                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                                        title="Onayla"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                )}
                                                {comment.isApproved && (
                                                    <button
                                                        onClick={() => handleApprove(comment.id, false)}
                                                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                                                        title="Onayı Kaldır"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(comment.id)}
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
