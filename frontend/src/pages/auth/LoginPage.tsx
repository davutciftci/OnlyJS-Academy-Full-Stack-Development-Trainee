import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login({ email, password });

            const { authService } = await import('../../services/authService');
            const currentUser = await authService.getCurrentUser();

            if (currentUser?.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
            setTimeout(() => setError(''), 10000);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-4 py-20">
            <div className="w-[500px]">
                <div className="flex space-x-4 text-center">
                    <button type="button" className="flex-1 border-t border-l border-r p-4 text-sm font-medium text-[#2126AB]">
                        Giriş Yap
                    </button>
                    <Link
                        to="/kayit"
                        className="flex-1 border-t border-r border-l p-4 text-sm font-medium bg-gray-100 text-[#333333]"
                    >
                        Üye Ol
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 border p-8">
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

                    <div>
                        <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                            *Şifre
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-[4px] bg-gray-100 text-sm focus:outline-none focus:border-gray-300"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="text-right">
                        <Link to="/sifremi-unuttum" className="text-xs text-gray-600 hover:text-gray-900 underline">
                            Şifremi Unuttum?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white p-4 text-sm rounded-[4px] font-bold tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
                    </button>
                </form>
            </div>
        </div>
    );
}
