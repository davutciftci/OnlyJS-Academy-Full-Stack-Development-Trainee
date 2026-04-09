import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import DiscountBadge from '../../components/ui/DiscountBadge';
import { productService } from '../../services/productService';
import { getBackendBaseUrl } from '../../config/api';
import type { Product } from '../../types';



const CATEGORY_CARDS = [
    {
        id: 1,
        title: 'PROTEİN',
        image: '/image/1.png',
        bgColor: 'var(--color-card-bg)',
        link: '/urunler?kategori=protein'
    },
    {
        id: 2,
        title: 'VİTA-\nMİNLER',
        image: '/image/2.png',
        bgColor: '#FDE8D7',
        link: '/urunler?kategori=vitamin'
    },
    {
        id: 3,
        title: 'SAĞLIK',
        image: '/image/3.png',
        bgColor: '#CCCBC6',
        link: '/urunler?kategori=saglik'
    },
    {
        id: 4,
        title: 'SPOR\nGIDALARI',
        image: '/image/4.png',
        bgColor: '#D9D8D3',
        link: '/urunler?kategori=spor'
    },
    {
        id: 5,
        title: 'GIDA',
        image: '/image/5.png',
        bgColor: '#72B4CE',
        link: '/urunler?kategori=gida'
    },
    {
        id: 6,
        title: 'TÜM\nÜRÜNLER',
        image: '/image/6.png',
        bgColor: '#ABD9EA',
        link: '/urunler'
    }
];

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const data = await productService.getProducts();
                setProducts(data.slice(0, 12)); // İlk 12 ürünü göster
            } catch (error) {
                console.error('Ürünler yüklenemedi:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="bg-white">
            { }
            <section className="relative w-full overflow-hidden">
                <div className="w-full aspect-[3/1] min-h-[180px]">
                    <img
                        src="/image/hero.png"
                        alt="OJS Nutrition - Spor Gıdaları"
                        className="w-full h-full object-cover object-center"
                        style={{ filter: 'brightness(1.2)' }}
                    />
                </div>
            </section>

            { }
            <section className="py-4 px-4 overflow-hidden">
                <div className="container-custom">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                        {CATEGORY_CARDS.map((card) => (
                            <div
                                key={card.id}
                                className="relative rounded-xl overflow-hidden aspect-[384/157]"
                                style={{ backgroundColor: card.bgColor }}
                            >
                                <img
                                    src={card.image}
                                    alt={card.title.replace('\n', ' ')}
                                    className="absolute left-0 top-0 h-full w-auto object-contain"
                                />
                                <div className="absolute inset-y-0 right-4 flex flex-col items-end justify-center gap-1 w-[140px] sm:w-[180px]">
                                    <div className="h-12 sm:h-16 flex items-end justify-end">
                                        <h3 className="text-base sm:text-lg lg:text-xl font-black text-black text-right whitespace-pre-line leading-tight">
                                            {card.title}
                                        </h3>
                                    </div>
                                    <Link
                                        to={card.link}
                                        className="bg-black text-white px-4 sm:px-6 lg:px-10 py-1 rounded-lg text-xs lg:text-sm font-bold mt-1"
                                    >
                                        İNCELE
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-8 px-4">
                <div className="container-custom">
                    <h2 className="text-xl font-bold text-center mb-8 tracking-wider">ÇOK SATANLAR</h2>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Ürünler yükleniyor...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Henüz ürün eklenmemiş</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {products.map((product, index) => {
                                const BACKEND_BASE_URL = getBackendBaseUrl();
                                const productImage = product.photos && product.photos.length > 0
                                    ? `${BACKEND_BASE_URL}${product.photos[0].url}`
                                    : '/images/placeholder-product.jpg';

                                const hasDiscount = product.variants && product.variants.some(v => v.discount && v.discount > 0);
                                const maxDiscount = hasDiscount && product.variants
                                    ? Math.max(...product.variants.map(v => v.discount || 0))
                                    : 0;

                                const originalPrice = product.variants && product.variants.length > 0
                                    ? product.variants[0].price
                                    : product.basePrice || 0;

                                const discountedPrice = maxDiscount > 0
                                    ? Math.round(originalPrice * (1 - maxDiscount / 100))
                                    : originalPrice;

                                return (
                                    <Link
                                        to={`/urun/${product.category?.slug || 'urunler'}/${product.slug}`}
                                        key={product.id}
                                        className="group flex flex-col"
                                        style={{ order: index }}
                                    >
                                        <div className="relative aspect-square mb-2 rounded-lg">
                                            <img
                                                src={productImage}
                                                alt={product.name}
                                                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {maxDiscount > 0 && (
                                                <DiscountBadge
                                                    percentage={maxDiscount}
                                                    className="absolute -top-2 -right-2 md:top-2 md:right-2 group-hover:scale-105 transition-transform duration-300"
                                                />
                                            )}
                                        </div>
                                        <div className="text-center flex flex-col items-center">
                                            <h3 className="text-xl sm:text-xl font-bold text-gray-900 leading-tight uppercase h-10 flex items-center justify-center">
                                                {product.name}
                                            </h3>
                                            <p className="text-md sm:text-md text-gray-500 leading-tight uppercase h-8 flex items-center justify-center">
                                                {product.description || 'Ürün açıklaması'}
                                            </p>
                                            <div className="flex items-center gap-0.5 mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm sm:text-sm text-gray-500 mb-2">
                                                {product.comments?.length || 0} Yorum
                                            </span>
                                            <div className="flex flex-row items-baseline gap-2 justify-center">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {Number(discountedPrice).toFixed(0)} TL
                                                </span>
                                                {maxDiscount > 0 && (
                                                    <span className="text-lg text-red-500 line-through">
                                                        {Number(originalPrice).toFixed(0)} TL
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

        </div>
    );
}
