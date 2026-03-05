import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/user/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'Şifre sıfırlama linki email adresinize gönderildi.');
                setEmail('');
            } else {
                setError(data.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-4 py-20">
            <div className="w-[500px]">
                <div className="flex space-x-4 text-center">
                    <Link
                        to="/giris"
                        className="flex-1 border-t border-l border-r p-4 text-sm font-medium bg-gray-100 text-[#333333]"
                    >
                        Giriş Yap
                    </Link>
                    <button className="flex-1 border-t border-r border-l p-4 text-sm font-medium text-[#2126AB]">
                        Şifremi Unuttum
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 border p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Şifrenizi mi Unuttunuz?</h2>
                        <p className="text-sm text-gray-600">
                            Email adresinizi girin, size şifre sıfırlama linki gönderelim.
                        </p>
                    </div>

                    {message && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-[4px] text-green-700 text-sm">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-[4px] text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                            *E-Posta
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-[4px] bg-gray-100 text-sm focus:outline-none focus:border-gray-300"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white p-4 text-sm rounded-[4px] font-bold tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'GÖNDERİLİYOR...' : 'SIFRE SIFIRLAMA LİNKİ GÖNDER'}
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
