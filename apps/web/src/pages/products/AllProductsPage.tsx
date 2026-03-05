import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MdOutlineStar } from 'react-icons/md';
import DiscountBadge from '../../components/ui/DiscountBadge';
import { productService } from '../../services/productService';
import type { Product } from '../../types';

export default function AllProductsPage() {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('kategori');
    const searchQuery = searchParams.get('search');

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const data = await productService.getProducts();
                setProducts(data);
            } catch (error) {
                console.error('Ürünler yüklenemedi:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        let matchesCategory = true;
        if (category) {
            const categorySlug = (product.category?.slug || '').toLowerCase();
            const categoryName = (product.category?.name || '').toLowerCase();
            const searchCategory = category.toLowerCase();
            matchesCategory = categorySlug.includes(searchCategory) || categoryName.includes(searchCategory);
        }

        let matchesSearch = true;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            matchesSearch = product.name.toLowerCase().includes(query) ||
                (product.description || '').toLowerCase().includes(query);
        }

        return matchesCategory && matchesSearch;
    });

    const getDisplayPrice = (product: Product) => {
        if (product.variants && product.variants.length > 0) {
            return Number(product.variants[0].price);
        }
        return product.basePrice || 0;
    };

    const getMaxDiscount = (product: Product) => {
        if (product.variants && product.variants.some(v => v.discount && v.discount > 0)) {
            return Math.max(...product.variants.map(v => v.discount || 0));
        }
        return 0;
    };

    const getDiscountedPrice = (product: Product) => {
        const price = getDisplayPrice(product);
        const discount = getMaxDiscount(product);
        if (discount > 0) {
            return Math.round(price * (1 - discount / 100));
        }
        return price;
    };

    const getProductImage = (product: Product) => {
        const BACKEND_BASE_URL = 'http://localhost:3000';
        if (product.photos && product.photos.length > 0) {
            return `${BACKEND_BASE_URL}${product.photos[0].url}`;
        }
        return '/images/placeholder-product.jpg';
    };

    const getPageTitle = () => {
        if (searchQuery) {
            return `ARAMA SONUÇLARI: "${searchQuery}"`;
        }
        if (!category) return 'TÜM ÜRÜNLER';
        const categoryTitles: { [key: string]: string } = {
            'vitamin': 'VİTAMİN',
            'gida': 'GIDA',
            'spor-gidalari': 'SPOR GIDALARI',
            'saglik': 'SAĞLIK',
            'protein': 'PROTEİN',
            'aksesuar': 'AKSESUAR',
            'paketler': 'PAKETLER',
            'lansmanaozel': 'LANSMANA ÖZEL FIRSATLAR',
        };
        return categoryTitles[category] || 'TÜM ÜRÜNLER';
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container-custom py-8">
                <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8 uppercase tracking-wide">
                    {getPageTitle()}
                </h1>

                {isLoading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Ürünler yükleniyor...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Ürün bulunamadı</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                        {filteredProducts.map((product) => {
                            const originalPrice = getDisplayPrice(product);
                            const discount = getMaxDiscount(product);
                            const discountedPrice = getDiscountedPrice(product);
                            const image = getProductImage(product);

                            return (
                                <Link
                                    key={product.id}
                                    to={`/urun/${product.category?.slug || 'urunler'}/${product.slug}`}
                                    className="group flex flex-col"
                                >
                                    <div className="relative aspect-square mb-2  rounded-lg">
                                        <img
                                            src={image}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {discount > 0 && (
                                            <DiscountBadge
                                                percentage={discount}
                                                className="absolute -top-2 -right-2 md:top-2 md:right-2"
                                            />
                                        )}
                                    </div>

                                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 text-center min-h-[1.75rem] flex items-center justify-center uppercase">
                                        {product.name}
                                    </h3>

                                    <p className="text-[10px] sm:text-xs text-gray-500 text-center min-h-[1.5rem] flex items-center justify-center leading-tight">
                                        {product.description || 'Ürün açıklaması'}
                                    </p>

                                    <div className="flex items-center justify-center gap-0.5 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <MdOutlineStar
                                                key={i}
                                                className={`w-3 h-3 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-[10px] sm:text-xs text-gray-500 text-center mb-2">
                                        {product.comments?.length || 0} Yorum
                                    </p>

                                    <div className="flex items-center justify-center gap-2 flex-wrap">
                                        <span className="text-sm font-bold text-gray-900">{discountedPrice.toFixed(0)} TL</span>
                                        {discount > 0 && (
                                            <span className="text-xs text-red-500 line-through">{originalPrice.toFixed(0)} TL</span>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                <div className="text-center text-gray-900 text-sm font-bold m-24">
                    Toplam {filteredProducts.length} ürün görüntüleniyor
                </div>
            </div>
        </div>
    );
}
