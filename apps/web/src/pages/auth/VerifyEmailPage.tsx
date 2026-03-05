import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

const VerifyEmailPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyEmail: verifyEmailAuth } = useAuth();
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resendTimer, setResendTimer] = useState(0);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // E-posta adresini state veya location'dan al
    const email = (location.state as { email: string } | null)?.email || localStorage.getItem('verify_email');

    useEffect(() => {
        if (!email) {
            navigate('/giris');
        }
    }, [email, navigate]);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendTimer]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) {
            setError('Lütfen 6 haneli kodu girin');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await verifyEmailAuth(email as string, code);
            localStorage.removeItem('verify_email');
            navigate('/', { replace: true });
        } catch (err: unknown) {
            const errorObj = err as { message?: string };
            setError(errorObj.message || 'Doğrulama başarısız');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await authService.resendCode(email as string);
            setResendTimer(60); // 1 dakika bekleme süresi
            setSuccessMessage('Yeni kod e-posta adresinize gönderildi (prtinnn@gmail.com)');
        } catch (err: unknown) {
            const errorObj = err as { message?: string };
            setError(errorObj.message || 'Kod gönderilemedi');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 p-6 bg-white rounded-2xl shadow-xl">
            <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">E-postanızı Doğrulayın</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Lütfen <span className="font-semibold text-blue-600">prtinnn@gmail.com</span> adresine gönderilen 6 haneli kodu girin.
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleVerify}>
                {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2 text-green-700 text-sm">
                        <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
                        <span>{successMessage}</span>
                    </div>
                )}

                <div className="rounded-md shadow-sm">
                    <input
                        type="text"
                        maxLength={6}
                        required
                        className="appearance-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-2xl text-center tracking-[1em] font-bold"
                        placeholder="000000"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading || code.length !== 6}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
                    >
                        {isLoading ? (
                            <RefreshCw className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Doğrula
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </button>
                </div>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isLoading || resendTimer > 0}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 transition-colors"
                    >
                        {resendTimer > 0 
                            ? `Yeni kod için bekleyin (${resendTimer}s)` 
                            : "Kodu Yeniden Gönder"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VerifyEmailPage;
