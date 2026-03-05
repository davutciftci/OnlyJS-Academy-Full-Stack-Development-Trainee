import { FiTrash } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function CartSidepanel() {
    const { items, isOpen, closeCart, updateQuantity, removeFromCart, totalPrice } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const getProductImage = (image: string) => {
        const BACKEND_BASE_URL = 'http://localhost:3000';
        if (image) {
            if (image.startsWith('http')) {
                return image;
            }
            return `${BACKEND_BASE_URL}${image}`;
        }
        return '/images/placeholder-product.jpg';
    };

    const handleCheckout = () => {
        closeCart();
        if (isAuthenticated) {
            navigate('/odeme');
        } else {
            navigate('/giris');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={closeCart}
            />

            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-xl flex flex-col">
                <div className="flex items-center justify-center p-6 bg-white relative">
                    <h2 className="text-lg font-bold text-[#000000]">SEPETİM</h2>
                    <button
                        onClick={closeCart}
                        className="absolute right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <IoClose className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <p className="text-sm text-[#000000]">Sepetinizde Ürün Bulunmamaktadır</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="flex justify-between p-4 bg-[#F9F9F9] mb-4">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 flex-shrink-0 bg-white p-1">
                                            <img
                                                src={getProductImage(item.image)}
                                                alt={item.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <Link
                                                to={`/urun/${item.categorySlug || 'urunler'}/${item.slug || item.id}`}
                                                onClick={closeCart}
                                                className="font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors block"
                                            >
                                                {item.name}
                                            </Link>
                                            {item.aroma && (
                                                <p className="text-xs text-gray-500">{item.aroma}</p>
                                            )}
                                            {item.size && (
                                                <p className="text-xs text-gray-500">{item.size}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end justify-between gap-4">
                                        <span className="font-bold text-gray-900 text-sm">{item.price} TL</span>

                                        <div className="flex items-center bg-white rounded border border-gray-200 h-8">
                                            {item.quantity === 1 ? (
                                                <button
                                                    onClick={() => removeFromCart(item.cartItemId)}
                                                    className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500"
                                                >
                                                    <FiTrash className="w-3.5 h-3.5" />
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => removeFromCart(item.cartItemId)}
                                                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 border-r border-gray-100"
                                                    >
                                                        <FiTrash className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 font-medium"
                                                    >
                                                        -
                                                    </button>
                                                </>
                                            )}

                                            <span className="w-8 h-full flex items-center justify-center text-sm font-medium text-gray-900 border-x border-gray-100">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 font-medium"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Ara Toplam</span>
                        <span className="text-gray-900">{(totalPrice).toFixed(2)} TL</span>
                    </div>

                    <div className="flex items-center justify-between font-bold border-t pt-3">
                        <span className="text-gray-900">TOPLAM</span>
                        <span className="text-gray-900">{totalPrice.toFixed(2)} TL</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={items.length === 0}
                        className="w-full py-3 bg-[#000000] text-white font-medium rounded flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        SEPETİ ONAYLA
                    </button>
                </div>
            </div>
        </>
    );
}
