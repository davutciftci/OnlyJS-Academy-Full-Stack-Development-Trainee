import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { VscSettings } from 'react-icons/vsc';
import { TfiPackage } from 'react-icons/tfi';
import { CiLocationOn } from 'react-icons/ci';
import { MessageSquare, Trash2, Edit2 } from 'lucide-react';
import { apiClient } from '../../api/client';
import { getBackendBaseUrl } from '../../config/api';
import ReviewModal from '../../components/ReviewModal';

interface OrderItem {
    id: number; 
    quantity: number;
    price: number;
    subtotal: number;
    productId: number;
    variant: {
        id: number;
        aroma: string;
        size: string;
        product: {
            id: number;
            name: string;
            slug: string;
            photos?: Array<{ url: string; isPrimary: boolean }>;
            category?: {
                slug: string;
            };
        };
    };
    productComments?: Array<{
        id: number;
        title?: string;
        rating: number;
        comment: string;
        userId: number;
    }>;
}

interface Order {
    id: number;
    orderNumber: string;
    status: string;
    totalAmount: number;
    subtotal: number;
    shippingCost: number;
    taxAmount: number;
    createdAt: string;
    paidAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
    items: OrderItem[];
    userId: number;
    shippingAddress: {
        fullName: string;
        addressLine1: string;
        city: string;
        district: string;
        postalCode?: string;
    };
}

export default function OrderDetailPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<{
        productId: number;
        productName: string;
        orderItemId: number;
    } | null>(null);
    const [editingComment, setEditingComment] = useState<{
        id: number;
        title?: string;
        rating: number;
        comment: string;
        productId: number;
        productName: string;
    } | null>(null);

    useEffect(() => {
        fetchOrder();
    }, [orderId, navigate]);

    const fetchOrder = async () => {
        try {
            const response = await apiClient.get(`/orders/${orderId}`);
            setOrder(response.data.data);
        } catch (error) {
            console.error('Sipariş yüklenemedi:', error);
            navigate('/hesabim?tab=orders');
        } finally {
            setLoading(false);
        }
    };

    const handleReviewClick = (productId: number, productName: string, orderItemId: number) => {
        setSelectedProduct({ productId, productName, orderItemId });
        setReviewModalOpen(true);
    };

    const handleDeleteReview = async (commentId: number) => {
        if (!confirm('Yorumunuzu silmek istediğinizden emin misiniz?')) return;

        try {
            await apiClient.delete(`/comments/${commentId}`);
            fetchOrder();
        } catch (error) {
            console.error('Yorum silinemedi:', error);
            alert('Yorum silinirken bir hata oluştu');
        }
    };

    const handleEditReview = (comment: { id: number; title?: string; rating: number; comment: string }, productId: number, productName: string) => {
        setEditingComment({
            id: comment.id,
            title: comment.title,
            rating: comment.rating,
            comment: comment.comment,
            productId,
            productName,
        });
        setReviewModalOpen(true);
    };

    const handleReviewSuccess = () => {
        fetchOrder();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    const getProductImage = (photos?: Array<{ url: string; isPrimary: boolean }>) => {
        const BACKEND_BASE_URL = getBackendBaseUrl();
        if (photos && photos.length > 0) {
            const primaryPhoto = photos.find(p => p.isPrimary) || photos[0];
            return `${BACKEND_BASE_URL}${primaryPhoto.url}`;
        }
        return '/images/placeholder-product.jpg';
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Beklemede';
            case 'CONFIRMED': return 'Onaylandı';
            case 'SHIPPED': return 'Kargoya Verildi';
            case 'DELIVERED': return 'Teslim Edildi';
            case 'CANCELLED': return 'İptal Edildi';
            default: return status;
        }
    };

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-64 flex-shrink-0">
                        <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8">Hesabım</h1>
                        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide">
                            <style>{`
                                .scrollbar-hide::-webkit-scrollbar {
                                    display: none;
                                }
                                .scrollbar-hide {
                                    -ms-overflow-style: none;
                                    scrollbar-width: none;
                                }
                            `}</style>
                            <Link
                                to="/hesabim"
                                className="flex-shrink-0 md:w-full flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors border whitespace-nowrap text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                            >
                                <VscSettings className="w-5 h-5" />
                                Hesap Bilgilerim
                            </Link>
                            <Link
                                to="/hesabim?tab=orders"
                                className="flex-shrink-0 md:w-full flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors border whitespace-nowrap text-sm bg-black text-white border-black"
                            >
                                <TfiPackage className="w-5 h-5" />
                                Siparişlerim
                            </Link>
                            <Link
                                to="/hesabim?tab=addresses"
                                className="flex-shrink-0 md:w-full flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors border whitespace-nowrap text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                            >
                                <CiLocationOn className="w-5 h-5" />
                                Adreslerim
                            </Link>
                        </nav>
                    </div>

                    <div className="flex-1">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">Sipariş {getStatusText(order.status)}</h2>
                            <p className="text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString('tr-TR')} Tarihinde Sipariş Verildi - {order.orderNumber} numaralı sipariş
                            </p>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex-1">
                                <div className="border-b-2 border-t-2 border-gray-300 py-4">
                                    <div className="space-y-6">
                                        {order.items.map((item) => {
                                            const userComment = item.productComments?.find(c => c.userId === order.userId);
                                            const canReview = order.status === 'DELIVERED' && !userComment;

                                            return (
                                                <div key={item.id} className="pb-6 border-b last:border-0">
                                                    <Link
                                                        to={`/urun/${item.variant.product.category?.slug || 'urunler'}/${item.variant.product.slug || item.id}`}
                                                        className="flex gap-4 hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2"
                                                    >
                                                        <div className="w-24 h-24 flex-shrink-0 p-2">
                                                            <img
                                                                src={getProductImage(item.variant.product.photos)}
                                                                alt={item.variant.product.name}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-gray-900 mb-1">{item.variant.product.name} x {item.quantity}</h3>
                                                            <p className="text-sm text-gray-900 font-semibold mb-1">{item.price.toLocaleString('tr-TR')} TL</p>
                                                            <p className="text-sm text-gray-600">Aroma: {item.variant.aroma}</p>
                                                            <p className="text-sm text-gray-600">Boyut: {item.variant.size}</p>
                                                        </div>
                                                    </Link>
                                                    
                                                    {canReview && (
                                                        <button
                                                            onClick={() => handleReviewClick(item.variant.product.id, item.variant.product.name, item.id)}
                                                            className="mt-3 flex items-center gap-2 px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                                                        >
                                                            <MessageSquare className="w-4 h-4" />
                                                            Yorum Yap
                                                        </button>
                                                    )}
                                                    
                                                    {userComment && (
                                                        <div className="mt-3 bg-gray-50 p-4 rounded-lg">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div className="flex items-center gap-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <span key={i} className={`text-lg ${i < userComment.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                                                    ))}
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => handleEditReview(userComment, item.variant.product.id, item.variant.product.name)}
                                                                        className="text-gray-600 hover:text-gray-800 p-1"
                                                                        title="Yorumu Düzenle"
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteReview(userComment.id)}
                                                                        className="text-red-600 hover:text-red-800 p-1"
                                                                        title="Yorumu Sil"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <h4 className="font-bold text-gray-900 text-sm mb-1">{userComment.title}</h4>
                                                            <p className="text-sm text-gray-700">{userComment.comment}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-80 space-y-4">
                                <div className="border-t-2 border-gray-300 py-4">
                                    <h3 className="font-bold text-gray-900 mb-3">Adres</h3>
                                    <p className="text-sm text-gray-700 font-semibold mb-1">{order.shippingAddress.fullName}</p>
                                    <p className="text-sm text-gray-700">{order.shippingAddress.addressLine1}</p>
                                    <p className="text-sm text-gray-700 underline">{order.shippingAddress.district} / {order.shippingAddress.city}</p>
                                    {order.shippingAddress.postalCode && (
                                        <p className="text-sm text-gray-700">Posta Kodu: {order.shippingAddress.postalCode}</p>
                                    )}
                                </div>

                                <div className="border-t-2 border-gray-300 py-4">
                                    <h3 className="font-bold text-gray-900 mb-3">Özet</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-700">Ara Toplam</span>
                                            <span className="text-gray-900">{order.subtotal.toLocaleString('tr-TR')} TL</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-700">Kargo</span>
                                            <span className="text-gray-900">{order.shippingCost.toLocaleString('tr-TR')} TL</span>
                                        </div>
                                        <div className="flex justify-between text-base font-bold pt-2 border-t-2 border-gray-200">
                                            <span className="text-gray-900">Toplam</span>
                                            <span className="text-gray-900">{order.totalAmount.toLocaleString('tr-TR')} TL</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3">Yardıma mı ihtiyacın var?</h3>
                                    <Link to="/S.S.S" className="text-sm text-gray-700 hover:text-black transition-colors underline">
                                        Sıkça Sorulan Sorular
                                    </Link>
                                    <br />
                                    <Link to="/sozlesme" className="text-sm text-gray-700 hover:text-black transition-colors underline mt-2 inline-block">
                                        Satış Sözleşmesi
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {(selectedProduct || editingComment) && (
                <ReviewModal
                    isOpen={reviewModalOpen}
                    onClose={() => {
                        setReviewModalOpen(false);
                        setSelectedProduct(null);
                        setEditingComment(null);
                    }}
                    productId={editingComment ? editingComment.productId : selectedProduct!.productId}
                    productName={editingComment ? editingComment.productName : selectedProduct!.productName}
                    orderId={editingComment ? undefined : parseInt(orderId || '0')}
                    orderItemId={editingComment ? undefined : selectedProduct!.orderItemId}
                    onSuccess={handleReviewSuccess}
                    editMode={!!editingComment}
                    existingComment={editingComment ? {
                        id: editingComment.id,
                        title: editingComment.title,
                        rating: editingComment.rating,
                        comment: editingComment.comment,
                        productId: editingComment.productId,
                        userId: 0,
                        isApproved: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    } : undefined}
                />
            )}
        </div>
    );
}
