import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { CiFaceSmile } from "react-icons/ci";
import { TfiPackage } from 'react-icons/tfi';
import { AiOutlineSafetyCertificate } from 'react-icons/ai';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { totalItems, openCart } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/urunler?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white sticky top-0 z-50 shadow-md">
            { }
            <div className=" border-gray-200 bg-white">
                <div className="container-custom my-6">
                    <div className="flex items-center justify-between h-12 gap-6">
                        { }
                        <button
                            onClick={toggleMenu}
                            className="md:hidden p-2 text-gray-900 flex-shrink-0"
                            aria-label="Menü"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>

                        { }
                        <Link to="/" className="flex items-center flex-shrink-0">
                            <img
                                src="/logo-dark.png"
                                alt="OJS Nutrition"
                                className="h-10 md:h-12"
                            />
                        </Link>

                        { }
                        <div className="hidden md:flex flex-1 justify-center lg:justify-end">
                            <div className="relative flex">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleSearchKeyPress}
                                    placeholder="Aradığınız ürünü yazınız..."
                                    className="px-4 py-2.5 border-gray-300 border-2 rounded-l-md focus:outline-none transition-colors w-[200px] lg:w-[316px]"
                                    style={{ height: '38px' }}
                                    aria-label="Ürün Ara"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="text-white px-4 lg:px-6 py-2.5 rounded-r-md font-medium transition-colors"
                                    style={{ backgroundColor: '#919191', height: '38px' }}
                                    aria-label="Arama Yap"
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7a7a7a'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#919191'}
                                >
                                    ARA
                                </button>
                            </div>
                        </div>

                        { }
                        <div className="hidden md:flex items-center space-x-3 lg:space-x-4 flex-shrink-0">
                            { }
                            <div
                                className="relative"
                                onMouseEnter={() => setIsAccountDropdownOpen(true)}
                                onMouseLeave={() => setIsAccountDropdownOpen(false)}
                            >
                                <button
                                    className="flex flex-col items-center justify-center gap-0.5 border-2 border-gray-400 rounded text-gray-700 transition-colors px-3 py-1"
                                    style={{ color: '#919191', minHeight: '38px' }}
                                    aria-label="Hesap Menüsü"
                                >
                                    <div className="flex items-center gap-1">
                                        <User className="w-5 h-5" />
                                        <span className="text-sm font-medium">HESAP</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                    {isAuthenticated && user && (
                                        <span className="text-xs font-normal text-gray-600">
                                            {user.firstName} {user.lastName}
                                        </span>
                                    )}
                                </button>

                                {/* Dropdown */}
                                {isAccountDropdownOpen && (
                                    <div className="absolute right-0 w-[100px] bg-white border border-gray-200 rounded shadow-lg z-50">
                                        {isAuthenticated ? (
                                            <>
                                                <Link
                                                    to="/hesabim"
                                                    className="flex items-center justify-center px-4 py-2 h-[38px] text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b"
                                                >
                                                    Hesabım
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center justify-center px-4 py-2 h-[38px] text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                >
                                                    Çıkış Yap
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    to="/giris"
                                                    className="flex items-center justify-center px-4 py-2 h-[38px] text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b"
                                                >
                                                    Üye Girişi
                                                </Link>
                                                <Link
                                                    to="/kayit"
                                                    className="flex items-center justify-center px-4 py-2 h-[38px] text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                >
                                                    Üye Ol
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            { }
                            <button
                                onClick={openCart}
                                className="flex relative items-center justify-center gap-2 text-white rounded transition-colors px-3"
                                style={{ backgroundColor: '#919191', height: '38px', width: '111px' }}
                                aria-label="Sepet"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <ShoppingCart className="w-5 h-5" />
                                        <span
                                            className="absolute -top-3 -right-3 text-white text-xs rounded-full flex items-center justify-center font-bold"
                                            style={{ backgroundColor: '#ED2727', height: '16px', width: '16px', fontSize: '10px' }}
                                        >
                                            {totalItems}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold">SEPET</span>
                                </div>
                            </button>
                        </div>

                        { }
                        { }
                        <button
                            onClick={openCart}
                            className="md:hidden p-2"
                            aria-label="Sepet"
                        >
                            <div className="relative">
                                <ShoppingCart className="w-6 h-6 text-gray-700" />
                                <span
                                    className="absolute -top-1.5 -right-1.5 text-white text-xs rounded-full flex items-center justify-center font-bold"
                                    style={{ backgroundColor: '#ED2727', height: '16px', width: '16px', fontSize: '9px' }}
                                >
                                    {totalItems}
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            { }
            <div className="hidden md:block bg-gray-900 text-white">
                <div className="container-custom">
                    <div className="flex items-center justify-between h-8">
                        <Link to="/urunler?kategori=protein" className="text-semibold">
                            PROTEİN
                        </Link>
                        <Link to="/urunler?kategori=spor-gidalari" className="text-semibold">
                            SPOR GIDALARI
                        </Link>
                        <Link to="/urunler" className="text-semibold">
                            TÜM ÜRÜNLER
                        </Link>
                        <Link to="/urunler?kategori=saglik" className="text-semibold">
                            SAĞLIK
                        </Link>
                        <Link to="/urunler?kategori=gida" className="text-semibold">
                            GIDA
                        </Link>
                        <Link to="/urunler?kategori=vitamin" className="text-semibold">
                            VİTAMİN
                        </Link>
                    </div>
                </div>
            </div>

            { }
            <div className="hidden md:block bg-gray-100 border-b border-gray-200">
                <div className="container-custom">
                    <div className="flex items-center justify-center h-10 text-xs">
                        <div className="flex items-center justify-around w-full space-x-4 lg:space-x-6 text-gray-700">
                            <div className='flex items-center gap-2'>
                                <TfiPackage className="w-5 h-5 lg:w-6 lg:h-6 font-extrabold" />
                                <span className="font-extrabold text-center">AYNI GÜN KARGO    </span>
                                <span className="font-semibold text-center">16.00'DAN ÖNCEKİ SİPARİŞLERDE</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <CiFaceSmile className="w-5 h-5 lg:w-6 lg:h-6 font-extrabold" />
                                <span className="font-extrabold text-center">ÜCRETSİZ KARGO</span>
                                <span className="font-semibold text-center">100 TL ÜZERİ SİPARİŞLERDE</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <AiOutlineSafetyCertificate className="w-5 h-5 lg:w-6 lg:h-6 font-extrabold" />
                                <span className="font-extrabold text-center">GÜVENLİ ALIŞVERİŞ</span>
                                <span className="font-semibold text-center">1.000.000+ MUTLU MÜŞTERİ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            { }
            <div className="md:hidden relative flex items-center mb-2 px-4">
                <button 
                    className="absolute px-3 left-3 p-1 border-none"
                    aria-label="Arama Yap"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    placeholder="ARADIĞINIZ ÜRÜNÜ YAZINIZ."
                    className="text-black w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-full focus:outline-none"
                    aria-label="Ürün Ara"
                />
            </div>

            { }
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-200">
                    <div className="flex flex-col">
                        { }
                        <div className="flex flex-col border-b border-gray-300">
                            <Link
                                to="/urunler?kategori=protein"
                                className="flex items-center justify-between px-6 py-4 text-gray-900 hover:bg-gray-50 font-semibold border-b border-gray-200"
                                onClick={toggleMenu}
                            >
                                <span>PROTEİN</span>
                                <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                            </Link>
                            <Link
                                to="/urunler?kategori=spor-gidalari"
                                className="flex items-center justify-between px-6 py-4 text-gray-900 hover:bg-gray-50 font-semibold border-b border-gray-200"
                                onClick={toggleMenu}
                            >
                                <span>SPOR GIDALARI</span>
                                <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                            </Link>
                            <Link
                                to="/urunler?kategori=saglik"
                                className="flex items-center justify-between px-6 py-4 text-gray-900 hover:bg-gray-50 font-semibold border-b border-gray-200"
                                onClick={toggleMenu}
                            >
                                <span>SAĞLIK</span>
                                <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                            </Link>
                            <Link
                                to="/urunler?kategori=gida"
                                className="flex items-center justify-between px-6 py-4 text-gray-900 hover:bg-gray-50 font-semibold border-b border-gray-200"
                                onClick={toggleMenu}
                            >
                                <span>GIDA</span>
                                <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                            </Link>
                            <Link
                                to="/urunler?kategori=vitamin"
                                className="flex items-center justify-between px-6 py-4 text-gray-900 hover:bg-gray-50 font-semibold border-b border-gray-200"
                                onClick={toggleMenu}
                            >
                                <span>VİTAMİN</span>
                                <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                            </Link>
                            <Link
                                to="/urunler"
                                className="flex items-center justify-between px-6 py-4 text-gray-900 hover:bg-gray-50 font-semibold"
                                onClick={toggleMenu}
                            >
                                <span>TÜM ÜRÜNLER</span>
                            </Link>
                        </div>

                        { }
                        <div className="bg-gray-200 flex flex-col">
                            <Link
                                to="/hesabim"
                                className="px-6 py-4 text-gray-900 hover:bg-gray-300 font-medium"
                                onClick={toggleMenu}
                            >
                                HESABIM
                            </Link>
                            <Link
                                to="/yorumlar"
                                className="px-6 py-4 text-gray-900 hover:bg-gray-300 font-medium"
                                onClick={toggleMenu}
                            >
                                MÜŞTERİ YORUMLARI
                            </Link>
                            <Link
                                to="/iletisim"
                                className="px-6 py-4 text-gray-900 hover:bg-gray-300 font-medium"
                                onClick={toggleMenu}
                            >
                                İLETİŞİM
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
