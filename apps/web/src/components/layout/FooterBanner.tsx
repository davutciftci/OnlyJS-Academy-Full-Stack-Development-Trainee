import { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { commentService } from '../../services';
import type { ProductComment } from '../../types';

export default function FooterBanner() {
    const [comments, setComments] = useState<ProductComment[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const itemsPerPage = 4;

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setIsLoading(true);
                const data = await commentService.getApprovedComments(50);
                setComments(data);
            } catch (error) {
                console.error('Yorumlar yüklenemedi:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchComments();
    }, []);

    const totalPages = Math.ceil(comments.length / itemsPerPage);

    const handlePrev = useCallback(() => {
        setCurrentIndex(prev => (prev === 0 ? Math.max(0, totalPages - 1) : prev - 1));
    }, [totalPages]);

    const handleNext = useCallback(() => {
        setCurrentIndex(prev => (prev >= totalPages - 1 ? 0 : prev + 1));
    }, [totalPages]);

    const visibleComments = comments.slice(
        currentIndex * itemsPerPage,
        (currentIndex + 1) * itemsPerPage
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    };

    return (
        <section className="w-full mb-24">
            <div className="w-full bg-black">
                <img
                    src="/images/Figure → image_1296.webp.png"
                    alt="OJS Nutrition Banner"
                    className="w-full h-auto object-cover"
                />
            </div>

            <div className="bg-white py-10 sm:py-1 border-t border-gray-100">
                <div className="container-custom">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 mb-8 pb-4 border-b border-gray-100 gap-4">
                        <h2 className="text-sm font-bold text-[#111111] tracking-tight uppercase">GERÇEK MÜŞTERİ YORUMLARI</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                                    ))}
                                </div>
                                <span className="text-[11px] font-bold text-[#111111] border-b border-[#111111] leading-none mb-0.5">
                                    {comments.length} Yorum
                                </span>
                            </div>
                            <div className="flex gap-1.5 ml-2">
                                <button
                                    onClick={handlePrev}
                                    className="p-1 hover:bg-gray-50 rounded transition-colors"
                                    disabled={comments.length === 0}
                                >
                                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="p-1 hover:bg-gray-50 rounded transition-colors"
                                    disabled={comments.length === 0}
                                >
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex flex-col gap-2 animate-pulse">
                                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-sm">Henüz onaylanmış yorum bulunmuyor.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {visibleComments.map((comment) => (
                                <div key={comment.id} className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-[#999999] font-medium tracking-tight">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3 h-3 ${i < comment.rating ? 'fill-[#FFB800] text-[#FFB800]' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <h4 className="text-[13px] font-black text-[#111111] uppercase tracking-tight line-clamp-1">
                                        {comment.user ? `${comment.user.firstName} ${comment.user.lastName?.charAt(0)}.` : 'Anonim'}
                                    </h4>
                                    <p className="text-[11px] text-[#666666] leading-[1.6] font-medium max-w-[240px] line-clamp-3">
                                        {comment.comment}
                                    </p>
                                    {comment.product && (
                                        <span className="text-[9px] text-[#999999] font-medium">
                                            {comment.product.name}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-6">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-[#111111]' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
