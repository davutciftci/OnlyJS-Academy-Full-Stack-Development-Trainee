import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import type { ProductComment } from '../../types';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState<ProductComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await apiClient.get('/comments/approved');
                setReviews(response.data.data);
            } catch (error) {
                console.error('Yorumlar yüklenemedi:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, []);

    return (
        <div className="bg-white min-h-screen">
            { }
            <div className="relative w-full h-[400px] bg-[#111] overflow-hidden">
                { }
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-lime-400/80 opacity-90"></div>

                { }
                <div className="container-custom relative h-full flex flex-col justify-center">
                    <div className="max-w-xl">
                        { }
                        <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                            OJS <br />
                            NUTRITION
                        </h1>

                        { }
                        <div className="absolute bottom-10 left-10 flex gap-1">
                            <div className="grid grid-cols-6 gap-1">
                                {[...Array(24)].map((_, i) => (
                                    <div key={i} className="w-1 h-1 bg-lime-500 rounded-full"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                { }
                <div className="absolute right-0 top-0 h-full w-1/2 flex items-end justify-center">
                    { }
                    { }
                </div>
            </div>

            { }
            <div className="container-custom py-16">
                { }
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-200 pb-6">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-2">GERÇEK MÜŞTERİ YORUMLARI</h2>
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <span className="text-sm font-bold underline decoration-2 underline-offset-4">{reviews.length} Yorum</span>
                        </div>
                    </div>

                    { }
                    <div className="flex gap-2 mt-4 md:mt-0">
                        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>

                { }
                {isLoading ? (
                    <div className="text-center text-gray-500 py-12">
                        Yorumlar yükleniyor...
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        Henüz yorum yapılmamış. İlk yorumu siz yapın!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {reviews.map((review) => (
                            <div key={review.id} className="flex flex-col gap-2">
                                <div className="flex items-center gap-1 mb-1">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={`filled-${i}`} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    ))}
                                    {[...Array(5 - review.rating)].map((_, i) => (
                                        <Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
                                    ))}
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium">
                                    {new Date(review.createdAt || '').toLocaleDateString('tr-TR')}
                                </span>
                                {review.title ? (
                                    <h3 className="font-black text-sm uppercase">{review.title}</h3>
                                ) : (
                                    <h3 className="font-black text-sm uppercase">KULLANICI YORUMU</h3>
                                )}
                                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsPage;
