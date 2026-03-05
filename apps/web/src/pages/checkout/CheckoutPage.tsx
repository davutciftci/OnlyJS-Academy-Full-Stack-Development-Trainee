import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { addressService } from '../../services';
import type { UserAddress } from '../../types';
import { apiClient } from '../../api/client';

interface ShippingMethod {
    id: number;
    name: string;
    code: string;
    price: number;
    deliveryDays: string;
    description: string | null;
}

export default function CheckoutPage() {
    const { items, totalPrice } = useCart();
    const { isAuthenticated, user, isLoading } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
    const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Partial<UserAddress> | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/giris');
        }
    }, [isAuthenticated, isLoading, navigate]);

    useEffect(() => {
        const fetchAddresses = async () => {
            if (isAuthenticated) {
                try {
                    const fetchedAddresses = await addressService.getMyAddresses();
                    setAddresses(fetchedAddresses);
                    if (fetchedAddresses.length > 0) {
                        setSelectedAddressId(fetchedAddresses[0].id);
                    }
                } catch (error) {
                    console.error('Adresler yüklenemedi:', error);
                }
            }
        };
        fetchAddresses();
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchShippingMethods = async () => {
            try {
                const response = await apiClient.get('/shipping');
                setShippingMethods(response.data.data);
            } catch (error) {
                console.error('Kargo yöntemleri yüklenemedi:', error);
            }
        };
        fetchShippingMethods();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Yükleniyor...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const handleEditAddress = (address: UserAddress) => {
        setEditingAddress(address);
        setIsEditing(true);
    };

    const handleAddNewAddress = () => {
        setEditingAddress({
            title: '',
            fullName: '',
            phoneNumber: '',
            addressLine1: '',
            city: '',
            district: '',
        });
        setIsEditing(true);
    };

    const handleSaveAddress = async () => {
        if (!editingAddress) return;

        try {
            if ('id' in editingAddress && editingAddress.id) {
                await addressService.updateAddress(editingAddress.id, editingAddress as Partial<UserAddress>);
                const updatedAddresses = await addressService.getMyAddresses();
                setAddresses(updatedAddresses);
            } else {
                await addressService.createAddress(editingAddress as Omit<UserAddress, 'id'>);
                const updatedAddresses = await addressService.getMyAddresses();
                setAddresses(updatedAddresses);
            }
            setIsEditing(false);
            setEditingAddress(null);
        } catch (error) {
            console.error('Adres kaydedilemedi:', error);
        }
    };

    const handleDeleteAddress = async () => {
        if (editingAddress && 'id' in editingAddress && editingAddress.id) {
            try {
                await addressService.deleteAddress(editingAddress.id);
                const updatedAddresses = await addressService.getMyAddresses();
                setAddresses(updatedAddresses);
                setIsEditing(false);
                setEditingAddress(null);
            } catch (error) {
                console.error('Adres silinemedi:', error);
            }
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId || !selectedShipping) {
            alert('Lütfen tüm bilgileri doldurun');
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                shippingAddressId: selectedAddressId,
                shippingMethodCode: selectedShipping
            };

            const response = await apiClient.post('/orders', orderData);
            const orderId = response.data.data.id;


            navigate(`/siparis-basarili/${orderId}`);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            alert(err.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row">
            { }
            <div className="flex-1 lg:w-[60%] px-4 py-8 lg:px-16 lg:py-12">
                { }
                <div className="flex justify-between items-start mb-12">
                    <Link to="/" className="block">
                        <h1 className="text-2xl font-black italic tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>
                            OJS <br />
                            NUTRITION
                        </h1>
                    </Link>
                    <div className="text-right">
                        <div className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                </div>

                { }
                <div className="space-y-8">
                    { }
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                                1
                            </div>
                            <h2 className={`text-xl font-bold ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Adres</h2>
                        </div>

                        {step === 1 && (
                            <div className="pl-12">
                                {!isEditing ? (
                                    <>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Teslimat Adresi</h3>
                                        <div className="space-y-4 mb-8">
                                            {addresses.map((addr) => (
                                                <div
                                                    key={addr.id}
                                                    onClick={() => setSelectedAddressId(addr.id)}
                                                    className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${selectedAddressId === addr.id
                                                        ? 'border-blue-600 bg-blue-50/10'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-3">
                                                            {selectedAddressId === addr.id ? (
                                                                <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                                                                    <Check className="w-3 h-3" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                                            )}
                                                            <span className="font-medium text-gray-900">{addr.title}</span>
                                                        </div>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }}
                                                            className="text-sm text-gray-500 hover:text-black font-medium"
                                                        >
                                                            Düzenle
                                                        </button>
                                                    </div>
                                                    <p className="text-gray-600 text-sm pl-8 leading-relaxed">
                                                        {addr.addressLine1}
                                                    </p>
                                                </div>
                                            ))}

                                            { }
                                            <div
                                                onClick={handleAddNewAddress}
                                                className="p-6 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer flex items-center gap-3 text-gray-600"
                                            >
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                                <span className="font-medium">Yeni Adres</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setStep(2)}
                                            disabled={addresses.length === 0 || selectedAddressId === null}
                                            className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {addresses.length === 0 ? 'Önce Adres Tanımlayın' : 'Kargo ile Devam Et'}
                                        </button>
                                    </>
                                ) : (

                                    <div className="animate-fade-in">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {editingAddress && 'id' in editingAddress ? 'Adres Düzenle' : 'Yeni Adres Ekle'}
                                            </h3>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="text-sm font-medium text-gray-500 hover:text-black"
                                            >
                                                Vazgeç
                                            </button>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-500 ml-1">Adres Başlığı *</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                                                    value={editingAddress?.title || ''}
                                                    onChange={(e) => setEditingAddress(prev => prev ? { ...prev, title: e.target.value } : null)}
                                                    placeholder="Örn: Ev, Ofis"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-500 ml-1">Ad Soyad *</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                                                    value={editingAddress?.fullName || ''}
                                                    onChange={(e) => setEditingAddress(prev => prev ? { ...prev, fullName: e.target.value } : null)}
                                                    placeholder="Ad Soyad"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-500 ml-1">Adres *</label>
                                                <textarea
                                                    className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors min-h-[100px] resize-none"
                                                    value={editingAddress?.addressLine1 || ''}
                                                    onChange={(e) => setEditingAddress(prev => prev ? { ...prev, addressLine1: e.target.value } : null)}
                                                    placeholder="Açık adresiniz"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-500 ml-1">İl *</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                                                        value={editingAddress?.city || ''}
                                                        onChange={(e) => setEditingAddress(prev => prev ? { ...prev, city: e.target.value } : null)}
                                                        placeholder="İl"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-500 ml-1">İlçe *</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                                                        value={editingAddress?.district || ''}
                                                        onChange={(e) => setEditingAddress(prev => prev ? { ...prev, district: e.target.value } : null)}
                                                        placeholder="İlçe"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-500 ml-1">Telefon *</label>
                                                <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:border-black transition-colors">
                                                    <div className="bg-gray-50 px-4 flex items-center gap-2 border-r border-gray-200">
                                                        <img src="https://flagcdn.com/w20/tr.png" alt="TR" className="w-5" />
                                                        <span className="text-sm font-medium text-gray-700">+90</span>
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        className="flex-1 p-4 focus:outline-none"
                                                        value={editingAddress?.phoneNumber || ''}
                                                        onChange={(e) => setEditingAddress(prev => prev ? { ...prev, phoneNumber: e.target.value } : null)}
                                                        placeholder="5XX XXX XX XX"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            {editingAddress && 'id' in editingAddress && editingAddress.id && (
                                                <button
                                                    onClick={handleDeleteAddress}
                                                    className="flex-1 py-4 border border-gray-200 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    Adresi Sil
                                                </button>
                                            )}
                                            <button
                                                onClick={handleSaveAddress}
                                                className="flex-1 py-4 bg-black text-white rounded-lg font-bold hover:bg-gray-900 transition-colors"
                                            >
                                                Kaydet
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    { }
                    <div className="opacity-100">
                        <div className="flex items-center gap-4 mb-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? 'bg-black text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                                2
                            </div>
                            <h2 className={`text-xl font-bold ${step === 2 ? 'text-gray-900' : 'text-gray-400'}`}>Kargo</h2>
                        </div>
                        {step === 2 && (
                            <div className="pl-12 py-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Kargo Seçimi</h3>
                                <div className="space-y-4 mb-6">
                                    {shippingMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            onClick={() => setSelectedShipping(method.code)}
                                            className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${selectedShipping === method.code
                                                ? 'border-blue-600 bg-blue-50/10'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    {selectedShipping === method.code ? (
                                                        <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                                    )}
                                                    <div>
                                                        <span className="font-bold text-gray-900 text-lg">{method.name}</span>
                                                        <p className="text-sm text-gray-600 mt-1">Teslimat süresi: {method.deliveryDays}</p>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-gray-900 text-lg">₺{method.price.toLocaleString('tr-TR')}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-4 mt-6">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-900 hover:bg-gray-50"
                                    >
                                        Geri
                                    </button>
                                    <button
                                        onClick={() => setStep(3)}
                                        disabled={!selectedShipping}
                                        className="flex-1 bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {selectedShipping ? 'Ödemeye Geç' : 'Önce Kargo Seçin'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    { }
                    <div className="opacity-100">
                        <div className="flex items-center gap-4 mb-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 3 ? 'bg-black text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                                3
                            </div>
                            <h2 className={`text-xl font-bold ${step === 3 ? 'text-gray-900' : 'text-gray-400'}`}>Ödeme</h2>
                        </div>
                        {step === 3 && (
                            <div className="pl-12 py-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Ödeme</h3>
                                <p className="text-gray-600 mb-6">
                                    Siparişinizi onaylamak için aşağıdaki butona tıklayın.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-900 hover:bg-gray-50"
                                    >
                                        Geri
                                    </button>
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={isSubmitting}
                                        className="flex-1 bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'İşleniyor...' : 'Sipariş Ver'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                { }
                <div className="mt-20 pt-8 border-t border-gray-100 flex gap-6 text-xs text-gray-400 justify-center lg:justify-start">
                    <Link to="/iade" className="hover:text-gray-600">Para İade Politikası</Link>
                    <span>•</span>
                    <Link to="/kvkk" className="hover:text-gray-600">Gizlilik Politikası</Link>
                    <span>•</span>
                    <Link to="/sozlesme" className="hover:text-gray-600">Hizmet Şartları</Link>
                </div>
            </div>

            { }
            <div className="lg:w-[40%] bg-gray-50 px-4 py-8 lg:px-12 lg:py-12 border-l border-gray-200 min-h-screen">
                <div className="sticky top-8">
                    <div className="space-y-6 mb-8">
                        {items.length > 0 ? (
                            items.map((item) => (
                                <div key={item.id} className="flex gap-4 items-start">
                                    <div className="relative w-16 h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Link to={`/urun/${item.categorySlug || 'urunler'}/${item.slug || item.id}`}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 object-contain"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/placeholder.png';
                                                }}
                                            />
                                        </Link>
                                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#1F23AA] text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <Link
                                            to={`/urun/${item.categorySlug || 'urunler'}/${item.slug || item.id}`}
                                            className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="text-xs text-gray-500 mt-1">{item.aroma ? item.aroma : 'Standart'}</p>
                                        <p className="text-xs text-gray-500">{item.size}</p>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {item.price.toLocaleString('tr-TR')} TL
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                Sepetinizde ürün bulunmamaktadır.
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 py-6 space-y-4">
                        <div className="flex justify-between items-center text-gray-600">
                            <span className="text-sm">Ara Toplam</span>
                            <span className="font-medium">{totalPrice.toLocaleString('tr-TR')} TL</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                            <span className="text-sm">Kargo</span>
                            <span className="font-medium">
                                {selectedShipping
                                    ? `${shippingMethods.find(m => m.code === selectedShipping)?.price.toLocaleString('tr-TR') || '0'} TL`
                                    : '0 TL'}
                            </span>
                        </div>
                        </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">Toplam</span>
                            <span className="text-xl font-bold text-gray-900">
                                {(() => {
                                    const shippingPrice = Number(shippingMethods.find(m => m.code === selectedShipping)?.price || 0);
                                    const total = totalPrice + shippingPrice;
                                    return total.toLocaleString('tr-TR');
                                })()} TL
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
