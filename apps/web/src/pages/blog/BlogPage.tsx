import { Link } from 'react-router-dom';

export default function BlogPage() {
    return (
        <div className="bg-white min-h-screen py-28">
            <div className="container-custom mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Blog</h1>
                    <p className="text-gray-600 text-lg">
                        Spor, beslenme ve sağlıklı yaşam hakkında bilgiler
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-12 text-center">
                        <div className="mb-6">
                            <svg
                                className="w-20 h-20 mx-auto text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Yakında Blog Yazıları Eklenecek
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Spor beslenmesi, antrenman programları, sağlıklı yaşam ve ürün incelemeleri hakkında
                            bilgilendirici blog yazılarımız çok yakında burada olacak.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/urunler"
                                className="bg-black text-white font-bold py-3 px-8 rounded hover:bg-gray-800 transition-colors uppercase tracking-wide text-sm"
                            >
                                Ürünleri İncele
                            </Link>
                            <Link
                                to="/iletisim"
                                className="bg-white text-black font-bold py-3 px-8 rounded border-2 border-black hover:bg-gray-50 transition-colors uppercase tracking-wide text-sm"
                            >
                                Bize Ulaşın
                            </Link>
                        </div>
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-bold mb-2">Spor Beslenmesi</h3>
                            <p className="text-gray-600 text-sm">
                                Protein, karbonhidrat ve yağ dengesi, beslenme zamanlaması ve daha fazlası
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-bold mb-2">Antrenman Programları</h3>
                            <p className="text-gray-600 text-sm">
                                Farklı hedefler için antrenman programları ve egzersiz teknikleri
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-bold mb-2">Ürün İncelemeleri</h3>
                            <p className="text-gray-600 text-sm">
                                Ürünlerimiz hakkında detaylı bilgiler, kullanım önerileri ve faydaları
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
