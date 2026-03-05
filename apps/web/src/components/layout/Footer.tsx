import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';

export default function Footer() {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const footerLinks = {
        ojsNutrition: [
            { name: 'İletişim', link: '/iletisim' },
            { name: 'Hakkımızda', link: '/hakkimizda' },
            { name: 'Sıkça Sorulan Sorular', link: '/S.S.S' },
            { name: 'KVKK', link: '/kvkk' },
            { name: 'Çalışma İlkelerimiz', link: '/ilkelerimiz' },
            { name: 'Satış Sözleşmesi', link: '/sozlesme' },
            { name: 'Garanti ve İade Koşulları', link: '/iade' },
            { name: 'Gerçek Müşteri Yorumları', link: '/yorumlar' },
            { name: 'Blog', link: '/blog' },
        ],
        kategoriler: [
            { name: 'Protein', link: '/urunler?kategori=protein' },
            { name: 'Spor Gıdaları', link: '/urunler?kategori=spor-gidalari' },
            { name: 'Sağlık', link: '/urunler?kategori=saglik' },
            { name: 'Gıda', link: '/urunler?kategori=gida' },
            { name: 'Vitamin', link: '/urunler?kategori=vitamin' },
            { name: 'Aksesuar', link: '/urunler?kategori=aksesuar' },
            { name: 'Tüm Ürünler', link: '/urunler' },
            { name: 'Paketler', link: '/urunler?kategori=paketler' },
            { name: 'Lansmana Özel Fırsatlar', link: '/urunler?kategori=lansmanaozel' },
        ],
        populerUrunler: [
            { name: 'Whey Protein', link: '/urun/protein/whey-protein' },
            { name: 'Cream of Rice', link: '/urun/gida/cream-of-rice' },
            { name: 'Creatine', link: '/urun/spor-gidalari/creatine' },
            { name: 'BCAA+', link: '/urun/spor-gidalari/milk-protein' },
            { name: 'Pre-Workout', link: '/urun/spor-gidalari/pre-workout-supreme' },
            { name: 'Fitness Paketi', link: '/urun/paketler/fitness-paketi' },
            { name: 'Collagen', link: '/urun/saglik/collagen-coffee' },
            { name: 'Günlük Vitamin Paketi', link: '/urun/vitamin/gunluk-vitamin-paketi' },
            { name: 'ZMA', link: '/urunler?q=zma' },
        ]
    };

    return (
        <footer className="bg-[#222222] text-[#E5E5E5] pt-16 pb-8">
            <div className="container-custom">
                { }
                <div className="flex flex-row items-center gap-3 mb-6">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
                        ))}
                    </div>
                    <span className="text-[#999999] text-[10px] sm:text-xs tracking-wider font-medium">(140.000+)</span>
                </div>

                { }
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
                    <h2 className="text-2xl md:text-3xl font-black leading-[1.1] tracking-tight uppercase max-w-xl italic">
                        LABORATUVAR TESTLİ ÜRÜNLER<br />
                        AYNI GÜN & ÜCRETSİZ KARGO<br />
                        MEMNUNİYET GARANTİSİ
                    </h2>
                    <div className="text-sm md:text-[15px] leading-relaxed text-[#FFFFFF] max-w-[440px] lg:pt-1.5 opacity-90 font-medium">
                        200.000'den fazla ürün yorumumuza dayanarak, ürünlerimizi seveceğinize eminiz. Eğer herhangi bir sebeple memnun kalmazsanız, bizimle iletişime geçtiğinde çözüme kavuşturacağız.
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between border-t border-gray-800 pt-16 mb-20 gap-10 md:gap-0">
                    <div className="flex flex-col gap-0 md:min-w-[200px]">
                        <div className="h-7 mb-6 flex items-center">
                            <img
                                src="/images/LOGO_Beyaz.png"
                                alt="OJS Nutrition"
                                className="h-7 w-fit object-contain"
                            />
                        </div>
                        <div className="hidden md:block">
                            <ul className="flex flex-col gap-3">
                                {footerLinks.ojsNutrition.map((link) => (
                                    <li key={link.name}>
                                        <Link to={link.link} onClick={scrollToTop} className="text-xs text-[#999999] hover:text-white transition-colors uppercase font-medium">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="hidden md:block md:min-w-[200px]">
                        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider h-7 flex items-center">Kategoriler</h3>
                        <ul className="flex flex-col gap-3">
                            {footerLinks.kategoriler.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.link} onClick={scrollToTop} className="text-xs text-[#999999] hover:text-white transition-colors uppercase font-medium">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="hidden md:block md:min-w-[200px]">
                        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider h-7 flex items-center">Popüler Ürünler</h3>
                        <ul className="flex flex-col gap-3">
                            {footerLinks.populerUrunler.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.link} onClick={scrollToTop} className="text-xs text-[#999999] hover:text-white transition-colors uppercase font-medium">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:hidden flex flex-col gap-2">
                        <div className="border-b border-gray-800">
                            <button
                                onClick={() => toggleSection('ojs')}
                                className="w-full flex justify-between items-center py-4 text-sm font-bold text-white uppercase tracking-wider"
                            >
                                OJS NUTRITION
                                {openSections['ojs'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            {openSections['ojs'] && (
                                <ul className="flex flex-col gap-3 pb-6 px-1">
                                    {footerLinks.ojsNutrition.map((link) => (
                                        <li key={link.name}>
                                            <Link to={link.link} onClick={scrollToTop} className="text-xs text-[#999999] uppercase">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="border-b border-gray-800">
                            <button
                                onClick={() => toggleSection('categories')}
                                className="w-full flex justify-between items-center py-4 text-sm font-bold text-white uppercase tracking-wider"
                            >
                                KATEGORİLER
                                {openSections['categories'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            {openSections['categories'] && (
                                <ul className="flex flex-col gap-3 pb-6 px-1 ">
                                    {footerLinks.kategoriler.map((link) => (
                                        <li key={link.name}>
                                            <Link to={link.link} onClick={scrollToTop} className="text-xs text-[#999999] uppercase">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="border-b border-gray-800">
                            <button
                                onClick={() => toggleSection('popular')}
                                className="w-full flex justify-between items-center py-4 text-sm font-bold text-white uppercase tracking-wider"
                            >
                                POPÜLER ÜRÜNLER
                                {openSections['popular'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            {openSections['popular'] && (
                                <ul className="flex flex-col gap-3 pb-6 px-1">
                                    {footerLinks.populerUrunler.map((link) => (
                                        <li key={link.name}>
                                            <Link to={link.link} onClick={scrollToTop} className="text-xs text-[#999999] uppercase">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                { }
                <div className="pt-8 text-[10px] text-[#999999] uppercase border-t border-gray-800/50">
                    Copyright © - Tüm Hakları Saklıdır.
                </div>
            </div>
        </footer>
    );
}
