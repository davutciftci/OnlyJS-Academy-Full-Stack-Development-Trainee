import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setError('Geçersiz şifre sıfırlama linki');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Şifreler eşleşmiyor');
            setTimeout(() => setError(''), 10000);
            return;
        }

        if (newPassword.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır');
            setTimeout(() => setError(''), 10000);
            return;
        }

        if (!token) {
            setError('Geçersiz şifre sıfırlama linki');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/user/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...');
                navigate('/giris');
            } else {
                setError(data.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
                setTimeout(() => setError(''), 10000);
            }
        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
            setTimeout(() => setError(''), 10000);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex items-center justify-center px-4 py-20">
                <div className="w-[500px] text-center">
                    <div className="p-8 border rounded-lg">
                        <h2 className="text-xl font-bold text-red-600 mb-4">Geçersiz Link</h2>
                        <p className="text-gray-600 mb-6">
                            Şifre sıfırlama linki geçersiz veya süresi dolmuş.
                        </p>
                        <Link
                            to="/sifremi-unuttum"
                            className="inline-block bg-black text-white px-6 py-3 rounded-[4px] font-bold hover:bg-gray-800 transition-colors"
                        >
                            Yeni Link Talep Et
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center px-4 py-20">
            <div className="w-[500px]">
                <div className="flex space-x-4 text-center">
                    <button className="flex-1 border-t border-l border-r p-4 text-sm font-medium text-[#2126AB]">
                        Şifre Sıfırla
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 border p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Yeni Şifre Belirleyin</h2>
                        <p className="text-sm text-gray-600">
                            Lütfen yeni şifrenizi girin.
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-[4px] text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="newPassword" className="block text-sm text-gray-700 mb-2">
                            *Yeni Şifre
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-[4px] bg-gray-100 text-sm focus:outline-none focus:border-gray-300"
                            required
                            disabled={isLoading}
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-2">
                            *Yeni Şifre (Tekrar)
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-[4px] bg-gray-100 text-sm focus:outline-none focus:border-gray-300"
                            required
                            disabled={isLoading}
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white p-4 text-sm rounded-[4px] font-bold tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'GÜNCELLENİYOR...' : 'ŞİFREYİ GÜNCELLE'}
                    </button>

                    <div className="text-center">
                        <Link to="/giris" className="text-xs text-gray-600 hover:text-gray-900 underline">
                            Giriş sayfasına dön
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
