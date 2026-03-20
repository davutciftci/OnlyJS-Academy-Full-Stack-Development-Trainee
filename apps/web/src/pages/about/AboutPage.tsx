import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/client';
import type { ProductComment } from '../../types';

export default function AboutPage() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<ProductComment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalComments, setTotalComments] = useState(0);
    const reviewsPerPage = 10;

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get(`/comments/approved?page=${currentPage}&limit=${reviewsPerPage}`);
                const data = response.data;
                
                setReviews(data.data || []);
                setTotalPages(data.pagination?.totalPages || 1);
                setTotalComments(data.pagination?.totalComments || 0);
            } catch (error) {
                console.error('Yorumlar yüklenemedi:', error);
                setReviews([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const certificates = [
        '/image/s1.png',
        '/image/s2.png',
        '/image/s3.png',
        '/image/s4.png',
        '/image/s5.png',
        '/image/s6.png'
    ];

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 9;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 5) {
                for (let i = 1; i <= 7; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 4) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 6; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="container-custom max-w-4xl">
                { }
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Sağlıklı ve Fit Yaşamaya Zevkli ve Kolay Hale Getirmek İçin Varız
                    </h1>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            Günümüzde sağlıklı yaşam tarzı ve fitness her zamankinden daha önemli hale geldi. Ancak yoğun iş temposu, stresli yaşam koşulları ve yetersiz beslenme alışkanlıkları nedeniyle birçok insan sağlıklı yaşamı sürdürmekte zorlanıyor.
                        </p>
                        <p>
                            İşte tam bu noktada devreye giriyoruz! OJS Nutrition olarak, sağlıklı ve fit yaşamı herkes için ulaşılabilir, keyifli ve sürdürülebilir kılma misyonuyla yola çıktık. Amacımız, en kaliteli spor gıda takviyelerini, bilimsel olarak desteklenmiş ürünleri ve uzman danışmanlık hizmetlerini bir araya getirerek, sizlerin hedeflerinize ulaşmasında yanınızda olmak.
                        </p>
                        <p>
                            Ürünlerimiz, uluslararası standartlara uygun olarak üretilmekte ve her biri titizlikle seçilmektedir. Protein tozlarından vitamin takviyelerine, sağlıklı atıştırmalıklardan performans artırıcı ürünlere kadar geniş bir yelpazede çözümler sunuyoruz.
                        </p>
                        <p>
                            Sadece ürün satmakla kalmıyor, aynı zamanda sağlıklı yaşam yolculuğunuzda size rehberlik ediyoruz. Uzman ekibimiz, beslenme programları, antrenman önerileri ve kişiselleştirilmiş danışmanlık hizmetleriyle her adımda yanınızda.
                        </p>
                    </div>
                </div>

                { }
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        1.000.000+ den Fazla Mutlu Müşteri
                    </h2>
                </div>

                { }
                <div className="mb-16">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Sertifikalarımız</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                        {certificates.map((cert, index) => (
                            <div key={index} className="flex items-center justify-center">
                                <img
                                    src={cert}
                                    alt={`Sertifika ${index + 1}`}
                                    className="w-20 h-20 object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                { }
                <div className="py-4">
                    <div className="flex items-center gap-2 mb-6 border-t-2 border-b-2 py-4">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">
                            {isLoading ? '...' : `${totalComments} Yorum`}
                        </span>
                    </div>
                </div>

                { }
                <div className="my-4">
                    <button 
                        onClick={() => navigate('/yorumlar')}
                        className="bg-gradient-to-r from-[#1F23AA] to-[#387EC7] hover:from-[#1a1e8f] hover:to-[#2e6ba5] text-white font-semibold px-6 py-3 transition-colors rounded-full"
                    >
                        ÜRÜN İNCELEMELERİ
                    </button>
                </div>

                { }
                {isLoading ? (
                    <div className="text-center text-gray-500 py-8">
                        Yorumlar yükleniyor...
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        Henüz yorum yapılmamış.
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-gray-100 rounded-2xl p-8">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        {/* Dolu yıldızlar */}
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={`filled-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                        {/* Boş yıldızlar */}
                                        {[...Array(5 - review.rating)].map((_, i) => (
                                            <Star key={`empty-${i}`} className="w-4 h-4 text-yellow-400" />
                                        ))}
                                        <span className="text-sm font-semibold text-gray-900">
                                            {review.user?.firstName} {review.user?.lastName?.charAt(0)}.
                                        </span>
                                        {review.isApproved && (
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium ml-2">
                                                ONAYLANDI
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm font-bold text-gray-500">
                                        {new Date(review.createdAt || '').toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                                {review.title && (
                                    <h4 className="text-sm font-bold text-gray-900 mb-2">
                                        {review.title}
                                    </h4>
                                )}
                                <p className="text-sm text-gray-600">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                { }
                {!isLoading && reviews.length > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`w-8 h-8 rounded-full transition-colors ${
                                currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-200'
                            }`}
                        >
                            ‹
                        </button>
                        {getPageNumbers().map((page, index) => (
                            typeof page === 'number' ? (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-8 h-8 rounded-full transition-colors ${
                                        page === currentPage ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'
                                    }`}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span key={index} className="w-8 h-8 flex items-center justify-center text-gray-400">
                                    {page}
                                </span>
                            )
                        ))}
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`w-8 h-8 rounded-full transition-colors ${
                                currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-200'
                            }`}
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
