import { useState } from 'react';

interface ContactPageProps {
    hideHeaderAndFooter?: boolean;
}

const ContactPage = ({ hideHeaderAndFooter = false }: ContactPageProps) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/contact/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message || 'Mesajınız başarıyla gönderildi!');
                setFormData({ firstName: '', lastName: '', email: '', message: '' });
            } else {
                const errorMessage = data.message || data.error || 'Bir hata oluştu. Lütfen tekrar deneyin.';
                setError(errorMessage);
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen py-28">
            <div className="container-custom mx-auto px-4">
                { }
                {!hideHeaderAndFooter && (
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-black mb-4">Bize Ulaşın</h1>
                    </div>
                )}
                <div className="max-w-3xl mx-auto mb-6 text-left">
                    <p className="text-gray-600 text-sm md:text-base">
                        Bize aşağıdaki iletişim formundan ulaşabilirsiniz.
                    </p>
                </div>

                { }
                <div className="max-w-3xl mx-auto">
                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            { }
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="İsim *"
                                    className="w-full h-[50px] bg-[#f9f9f9] border-[1px] border-[#E5E5E5] rounded p-3 text-gray-800 placeholder-gray-400 focus:ring-0"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            { }
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Soyad *"
                                    className="w-full h-[50px] bg-[#f9f9f9] border-[1px] border-[#E5E5E5] rounded p-3 text-gray-800 placeholder-gray-400 focus:ring-0"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        { }
                        <div className="space-y-2">
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="E-Posta *"
                                className="w-full h-[50px] bg-[#f9f9f9] border-[1px] border-[#E5E5E5] rounded p-3 text-gray-800 placeholder-gray-400 focus:ring-0"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        { }
                        <div className="space-y-2">
                            <textarea
                                id="message"
                                rows={8}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Mesaj *"
                                className="w-full h-[150px] bg-[#f9f9f9] border-[1px] border-[#E5E5E5] rounded p-3 text-gray-800 placeholder-gray-400 focus:ring-0 resize-none"
                                required
                                disabled={isLoading}
                            ></textarea>
                        </div>

                        { }
                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-black text-white font-bold py-3.5 px-12 rounded hover:bg-gray-800 transition-colors uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'GÖNDERİLİYOR...' : 'GÖNDER'}
                            </button>
                        </div>
                    </form>

                    { }
                    {!hideHeaderAndFooter && (
                        <div className="mt-12 text-center space-y-4">
                            <p className="text-[12px] font-medium text-black">
                                *Aynı gün kargo hafta içi 16:00, Cumartesi ise 11:00'e kadar verilen siparişler için geçerlidir.
                            </p>
                            <p className="text-[12px] font-medium text-black">
                                Siparişler kargoya verilince e-posta ve sms ile bilgilendirme yapılır.
                            </p>

                            <div className="pt-2 text-[12px] font-medium text-center text-black leading-relaxed max-w-2xl mx-auto">
                                Telefon ile <span className="font-bold">0850 303 29 89 </span>
                                numarasını arayarak da bizlere sesli mesaj bırakabilirsiniz. Sesli mesajlarınıza hafta içi saat
                                <span className="font-bold"> 09:00-17:00</span> arasında dönüş sağlanmaktadır.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
