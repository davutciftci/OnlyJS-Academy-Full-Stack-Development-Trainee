import { useState, useEffect } from 'react';
import { X, Star, CheckCircle, AlertCircle } from 'lucide-react';
import { apiClient } from '../api/client';
import type { ProductComment } from '../types/product';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: number;
    productName: string;
    orderId?: number;
    orderItemId?: number;
    onSuccess: () => void;
    editMode?: boolean;
    existingComment?: ProductComment;
}

export default function ReviewModal({
    isOpen,
    onClose,
    productId,
    productName,
    orderId,
    orderItemId,
    onSuccess,
    editMode = false,
    existingComment,
}: ReviewModalProps) {
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    useEffect(() => {
        if (editMode && existingComment) {
            setRating(existingComment.rating);
            setTitle(existingComment.title || '');
            setComment(existingComment.comment);
        } else {
            // Create mode için default değerler
            setRating(5);
            setTitle('');
            setComment('');
        }
    }, [editMode, existingComment, isOpen]);

    if (!isOpen) return null;

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!comment.trim()) {
            showNotification('error', 'Lütfen yorum yazınız');
            return;
        }

        setIsSubmitting(true);

        try {
            if (editMode && existingComment) {
                await apiClient.patch(`/comments/${existingComment.id}`, {
                    rating,
                    title: title.trim() || undefined,
                    comment: comment.trim(),
                });
                showNotification('success', 'Yorumunuz güncellendi. Admin onayından sonra yayınlanacaktır.');
            } else {
                await apiClient.post('/comments', {
                    productId,
                    orderId,
                    orderItemId,
                    rating,
                    title: title.trim() || undefined,
                    comment: comment.trim(),
                });
                showNotification('success', 'Yorumunuz başarıyla gönderildi. Admin onayından sonra yayınlanacaktır.');
            }
            
            setTimeout(() => {
                onClose();
                onSuccess();
            }, 2000);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string; error?: string } } };
            console.error('Yorum gönderilemedi:', error);
            console.error('Hata detayı:', err.response?.data);
            showNotification('error', err.response?.data?.message || err.response?.data?.error || 'Yorum gönderilirken bir hata oluştu');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                {notification && (
                    <div
                        className={`absolute top-4 left-4 right-4 p-4 rounded-lg flex items-center gap-3 ${
                            notification.type === 'success'
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-red-50 border border-red-200'
                        } animate-slide-down z-10`}
                    >
                        {notification.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        )}
                        <p
                            className={`text-sm font-medium ${
                                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                            }`}
                        >
                            {notification.message}
                        </p>
                    </div>
                )}

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        {editMode ? 'Yorumu Düzenle' : 'Ürün Yorumu'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600">{productName}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Puanınız
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 ${
                                            star <= (hoveredRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Başlık (Opsiyonel)
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Örn: Süper, Harika, Mükemmel"
                            maxLength={100}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Yorumunuz *
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                            rows={5}
                            placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
                            required
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Gönderiliyor...' : (editMode ? 'Güncelle' : 'Gönder')}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes slide-down {
                    from {
                        transform: translateY(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
