import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { VscSettings } from 'react-icons/vsc';
import { TfiPackage } from 'react-icons/tfi';
import { CiLocationOn } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { addressService } from '../../services';
import type { UserAddress } from '../../types';
import { apiClient } from '../../api/client';



export default function AccountPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tabFromUrl || 'account');
    const [selectedCountry, setSelectedCountry] = useState({ code: '+90', flag: 'tr', name: 'Türkiye' });
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: ''
    });

    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    useEffect(() => {
        if (tabFromUrl) {
            setActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    useEffect(() => {
        if (user) {
            const userWithPhone = user as { phoneNumber?: string; phone?: string };
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: userWithPhone.phoneNumber || userWithPhone.phone || '',
                email: user.email || ''
            });
        }
    }, [user]);


    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
    const [addressFormData, setAddressFormData] = useState({
        title: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        addressLine1: '',
        city: '',
        district: '',
        postalCode: ''
    });

    useEffect(() => {
        const fetchAddresses = async () => {
            if (user) {
                try {
                    const fetchedAddresses = await addressService.getMyAddresses();
                    setAddresses(fetchedAddresses);
                } catch (error) {
                    console.error('Adresler yüklenemedi:', error);
                }
            }
        };
        fetchAddresses();
    }, [user]);

    const countries = [
        { code: '+90', flag: 'tr', name: 'Türkiye' },
        { code: '+1', flag: 'us', name: 'Amerika' },
        { code: '+44', flag: 'gb', name: 'İngiltere' },
        { code: '+49', flag: 'de', name: 'Almanya' },
        { code: '+33', flag: 'fr', name: 'Fransa' },
        { code: '+7', flag: 'ru', name: 'Rusya' },
        { code: '+86', flag: 'cn', name: 'Çin' },
        { code: '+81', flag: 'jp', name: 'Japonya' },
        { code: '+91', flag: 'in', name: 'Hindistan' },
        { code: '+971', flag: 'ae', name: 'BAE' }
    ];


    interface Order {
        id: number;
        orderNumber: string;
        status: string;
        createdAt: string;
        totalAmount: number;
        items?: Array<{
            id: number;
            variant: {
                product: {
                    photos: Array<{ url: string }>;
                    name: string;
                }
            }
        }>;
    }

    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user && activeTab === 'orders') {
                setLoadingOrders(true);
                try {
                    const response = await apiClient.get('/orders/my');
                    setOrders(response.data.data || []);
                } catch (error) {
                    console.error('Siparişler yüklenemedi:', error);
                    setOrders([]);
                } finally {
                    setLoadingOrders(false);
                }
            }
        };
        fetchOrders();
    }, [user, activeTab]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('Lütfen tekrar giriş yapın');
                return;
            }

            const requestBody: any = {};

            if (formData.firstName) requestBody.firstName = formData.firstName;
            if (formData.lastName) requestBody.lastName = formData.lastName;
            if (formData.phone && formData.phone.trim() !== '') {
                requestBody.phoneNumber = formData.phone;
            }

            const response = await fetch('http://localhost:3000/api/user/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Profil güncellenemedi');
            }

            await response.json();
            alert('Bilgileriniz başarıyla güncellendi!');

            window.location.reload();
        } catch (error: unknown) {
            const err = error as { message?: string };
            alert(err.message || 'Bir hata oluştu, lütfen tekrar deneyin');
        }
    };

    const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAddressFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddNewAddress = () => {
        setShowAddressForm(true);
        setEditingAddressId(null);
        setAddressFormData({
            title: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            addressLine1: '',
            city: '',
            district: '',
            postalCode: ''
        });
    };

    const handleEditAddress = (address: UserAddress) => {
        setShowAddressForm(true);
        setEditingAddressId(address.id);

        const nameParts = address.fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setAddressFormData({
            title: address.title,
            firstName,
            lastName,
            phoneNumber: address.phoneNumber,
            addressLine1: address.addressLine1,
            city: address.city,
            district: address.district,
            postalCode: address.postalCode || ''
        });
    };

    const handleDeleteAddress = async (id: number) => {
        try {
            await addressService.deleteAddress(id);
            const updatedAddresses = await addressService.getMyAddresses();
            setAddresses(updatedAddresses);
        } catch (error) {
            console.error('Adres silinemedi:', error);
            alert('Adres silinirken bir hata oluştu');
        }
    };

    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const fullName = `${addressFormData.firstName.trim()} ${addressFormData.lastName.trim()}`.trim();

            const addressData = {
                title: addressFormData.title,
                fullName,
                phoneNumber: addressFormData.phoneNumber,
                addressLine1: addressFormData.addressLine1,
                city: addressFormData.city,
                district: addressFormData.district,
                postalCode: addressFormData.postalCode
            };

            if (editingAddressId) {
                await addressService.updateAddress(editingAddressId, addressData);
            } else {
                await addressService.createAddress(addressData);
            }

            const updatedAddresses = await addressService.getMyAddresses();
            setAddresses(updatedAddresses);

            setShowAddressForm(false);
            setEditingAddressId(null);
            setAddressFormData({
                title: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                addressLine1: '',
                city: '',
                district: '',
                postalCode: ''
            });
        } catch (error: any) {
            console.error('Adres kaydedilemedi:', error);
            console.error('Hata detayı:', error.response?.data);
            alert(`Adres kaydedilirken bir hata oluştu: ${error.response?.data?.message || error.message}`);
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
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`flex-shrink-0 md:w-full flex items-center gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-colors border whitespace-nowrap text-sm ${activeTab === 'account'
                                    ? 'bg-black text-white border-black'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                                    }`}
                            >
                                <VscSettings className="w-5 h-5" />
                                <span className="font-medium">Hesap Bilgilerim</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex-shrink-0 md:w-full flex items-center gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-colors border whitespace-nowrap text-sm ${activeTab === 'orders'
                                    ? 'bg-black text-white border-black'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                                    }`}
                            >
                                <TfiPackage className="w-5 h-5" />
                                <span className="font-medium">Siparişlerim</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('addresses')}
                                className={`flex-shrink-0 md:w-full flex items-center gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-colors border whitespace-nowrap text-sm ${activeTab === 'addresses'
                                    ? 'bg-black text-white border-black'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                                    }`}
                            >
                                <CiLocationOn className="w-5 h-5" />
                                <span className="font-medium">Adreslerim</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('password')}
                                className={`flex-shrink-0 md:w-full flex items-center gap-2 px-2 md:px-4 py-2 md:py-3 rounded-lg transition-colors border whitespace-nowrap text-sm ${activeTab === 'password'
                                    ? 'bg-black text-white border-black'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                                    }`}
                            >
                                <RiLockPasswordLine className="w-5 h-5" />
                                <span className="font-medium">Şifre Değiştir</span>
                            </button>
                        </nav>
                    </div>

                    <div className="flex-1">
                        {activeTab === 'account' && (
                            <div className="px-4 md:px-8 py-4">
                                <h2 className="text-xl font-bold mb-6">Hesap Bilgilerim</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                *Ad
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                placeholder="Adınız"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                *Soyad
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                placeholder="Soyadınız"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Telefon
                                        </label>
                                        <div className="flex gap-2">
                                            <div className="relative">
                                                <select
                                                    value={selectedCountry.code}
                                                    onChange={(e) => {
                                                        const country = countries.find(c => c.code === e.target.value);
                                                        if (country) setSelectedCountry(country);
                                                    }}
                                                    className="appearance-none w-36 flex items-center gap-2 pl-12 pr-8 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-pointer focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                                >
                                                    {countries.map((country) => (
                                                        <option key={country.code} value={country.code}>
                                                            {country.code}
                                                        </option>
                                                    ))}
                                                </select>
                                                <img
                                                    src={`https://flagcdn.com/w40/${selectedCountry.flag}.png`}
                                                    alt={selectedCountry.name}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-4 object-cover rounded pointer-events-none"
                                                />
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                placeholder="5XX XXX XX XX"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            *Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled
                                            className="w-full px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg cursor-not-allowed opacity-60"
                                            placeholder="iletisim@onlyjs.com"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            Kaydet
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="px-4 md:px-8 py-4">
                                <h2 className="text-xl font-bold mb-2">Siparişlerim ({orders.length})</h2>
                                {loadingOrders ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 mb-4">Henüz siparişiniz bulunmamaktadır.</p>
                                        <Link
                                            to="/urunler"
                                            className="inline-block px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            Alışverişe Başla
                                        </Link>
                                    </div>
                                ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.id} className="border-b border-gray-200 py-4 last:border-0">
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="text-sm text-green-600 font-medium mb-1">
                                                            {order.status === 'PENDING' && 'Beklemede'}
                                                            {order.status === 'CONFIRMED' && 'Onaylandı'}
                                                            {order.status === 'SHIPPED' && 'Kargoya verildi'}
                                                            {order.status === 'DELIVERED' && 'Teslim Edildi'}
                                                            {order.status === 'CANCELLED' && 'İptal Edildi'}
                                                        </p>
                                                        <h3 className="text-sm font-bold text-gray-900 mb-1">Sipariş No: {order.orderNumber}</h3>
                                                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('tr-TR')} Tarihinde Sipariş Verildi</p>
                                                        <p className="text-xs text-gray-500 mt-1">Toplam: {order.totalAmount} TL</p>
                                                    </div>
                                                    <button
                                                        onClick={() => navigate(`/siparis/${order.id}`)}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        Detayı Görüntüle
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="px-4 md:px-8 py-4">
                                {addresses.length === 0 && !showAddressForm ? (
                                    <>
                                        <h2 className="text-xl font-bold mb-6">Adres Oluştur</h2>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                            <p className="text-sm text-gray-700">
                                                Kayıtlı bir adresiniz yok. Lütfen aşağıdaki kısımdan adres oluşturunuz.
                                            </p>
                                        </div>

                                        <form onSubmit={handleAddressSubmit} className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    *Adres Başlığı
                                                </label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={addressFormData.title}
                                                    onChange={handleAddressInputChange}
                                                    className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                    placeholder="ör, Ev, İş..."
                                                    required
                                                />
                                            </div>


                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        *Ad
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={addressFormData.firstName}
                                                        onChange={handleAddressInputChange}
                                                        placeholder="Ad"
                                                        className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        *Soyad
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        value={addressFormData.lastName}
                                                        onChange={handleAddressInputChange}
                                                        placeholder="Soyad"
                                                        className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    *Adres
                                                </label>
                                                <textarea
                                                    name="addressLine1"
                                                    value={addressFormData.addressLine1}
                                                    onChange={handleAddressInputChange}
                                                    rows={4}
                                                    className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Şehir
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={addressFormData.city}
                                                        onChange={handleAddressInputChange}
                                                        className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        *İlçe
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="district"
                                                        value={addressFormData.district}
                                                        onChange={handleAddressInputChange}
                                                        className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Telefon
                                                </label>
                                                <div className="flex gap-2">
                                                    <div className="relative">
                                                        <select
                                                            className="appearance-none w-36 flex items-center gap-2 pl-12 pr-8 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-pointer focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                                        >
                                                            {countries.map((country) => (
                                                                <option key={country.code} value={country.code}>
                                                                    {country.code}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <img
                                                            src="https://flagcdn.com/w40/tr.png"
                                                            alt="Türkiye"
                                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-4 object-cover rounded pointer-events-none"
                                                        />
                                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        name="phoneNumber"
                                                        value={addressFormData.phoneNumber}
                                                        onChange={handleAddressInputChange}
                                                        className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                                >
                                                    Kaydet
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        {!showAddressForm ? (
                                            <>
                                                <div className="flex items-center justify-between mb-6">
                                                    <h2 className="text-xl font-bold">Adreslerim ({addresses.length})</h2>
                                                    <button
                                                        onClick={handleAddNewAddress}
                                                        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                                                    >
                                                        <span className="text-xl">+</span>
                                                        Yeni adres ekle
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {addresses.map((address) => (
                                                        <div key={address.id} className="border border-gray-300 rounded-lg p-6 flex flex-col min-h-[180px]">
                                                            <h3 className="font-bold text-gray-900 mb-3">{address.title}</h3>
                                                            <p className="text-sm text-gray-700 mb-4 leading-relaxed whitespace-pre-line flex-1">
                                                                {address.addressLine1}
                                                            </p>
                                                            <div className="flex justify-between items-center gap-4 pt-4 border-t border-gray-200">
                                                                <button
                                                                    onClick={() => handleEditAddress(address)}
                                                                    className="text-sm text-gray-600 hover:text-black transition-colors"
                                                                >
                                                                    Adresi Düzenle
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteAddress(address.id)}
                                                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
                                                                >
                                                                    <MdDeleteOutline className="w-5 h-5" />
                                                                    Sil
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between mb-6">
                                                    <h2 className="text-xl font-bold">
                                                        {editingAddressId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
                                                    </h2>
                                                </div>

                                                <form onSubmit={handleAddressSubmit} className="space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            *Adres Başlığı
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="title"
                                                            value={addressFormData.title}
                                                            onChange={handleAddressInputChange}
                                                            className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                            placeholder="ör, Ev, İş..."
                                                            required
                                                        />
                                                    </div>


                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                *Ad
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="firstName"
                                                                value={addressFormData.firstName}
                                                                onChange={handleAddressInputChange}
                                                                placeholder="Ad"
                                                                className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                *Soyad
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="lastName"
                                                                value={addressFormData.lastName}
                                                                onChange={handleAddressInputChange}
                                                                placeholder="Soyad"
                                                                className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            *Adres
                                                        </label>
                                                        <textarea
                                                            name="addressLine1"
                                                            value={addressFormData.addressLine1}
                                                            onChange={handleAddressInputChange}
                                                            rows={4}
                                                            className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                Şehir
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="city"
                                                                value={addressFormData.city}
                                                                onChange={handleAddressInputChange}
                                                                className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                *İlçe
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="district"
                                                                value={addressFormData.district}
                                                                onChange={handleAddressInputChange}
                                                                className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Telefon
                                                        </label>
                                                        <div className="flex gap-2">
                                                            <div className="relative">
                                                                <select
                                                                    className="appearance-none w-36 flex items-center gap-2 pl-12 pr-8 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-pointer focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                                                                >
                                                                    {countries.map((country) => (
                                                                        <option key={country.code} value={country.code}>
                                                                            {country.code}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <img
                                                                    src="https://flagcdn.com/w40/tr.png"
                                                                    alt="Türkiye"
                                                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-4 object-cover rounded pointer-events-none"
                                                                />
                                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                                            </div>
                                                            <input
                                                                type="tel"
                                                                name="phoneNumber"
                                                                value={addressFormData.phoneNumber}
                                                                onChange={handleAddressInputChange}
                                                                className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-end gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowAddressForm(false)}
                                                            className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                                        >
                                                            İptal
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                                        >
                                                            Kaydet
                                                        </button>
                                                    </div>
                                                </form>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'password' && (
                            <div className="px-4 md:px-8 py-4">
                                <h2 className="text-xl font-bold mb-6">Şifre Değiştir</h2>
                                
                                {passwordSuccess && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm mb-4">
                                        {passwordSuccess}
                                    </div>
                                )}

                                {passwordError && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm mb-4">
                                        {passwordError}
                                    </div>
                                )}

                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    setPasswordError('');
                                    setPasswordSuccess('');

                                    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
                                        setPasswordError('Yeni şifreler eşleşmiyor');
                                        return;
                                    }

                                    if (passwordFormData.newPassword.length < 6) {
                                        setPasswordError('Yeni şifre en az 6 karakter olmalıdır');
                                        return;
                                    }

                                    try {
                                        const response = await apiClient.post('/user/change-password', {
                                            currentPassword: passwordFormData.currentPassword,
                                            newPassword: passwordFormData.newPassword,
                                            confirmPassword: passwordFormData.confirmPassword
                                        });

                                        if (response.data.status === 'success') {
                                            setPasswordSuccess('Şifreniz başarıyla güncellendi!');
                                            setPasswordFormData({
                                                currentPassword: '',
                                                newPassword: '',
                                                confirmPassword: ''
                                            });
                                        }
                                    } catch (error: any) {
                                        setPasswordError(error.response?.data?.message || 'Şifre değiştirme başarısız oldu');
                                    }
                                }} className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            *Mevcut Şifre
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordFormData.currentPassword}
                                            onChange={(e) => setPasswordFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                            className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            placeholder="Mevcut şifrenizi girin"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            *Yeni Şifre
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordFormData.newPassword}
                                            onChange={(e) => setPasswordFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                                            className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            placeholder="Yeni şifrenizi girin (en az 6 karakter)"
                                            required
                                            minLength={6}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            *Yeni Şifre (Tekrar)
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordFormData.confirmPassword}
                                            onChange={(e) => setPasswordFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className="w-full px-4 py-3 border bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                            placeholder="Yeni şifrenizi tekrar girin"
                                            required
                                            minLength={6}
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            Şifreyi Güncelle
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
