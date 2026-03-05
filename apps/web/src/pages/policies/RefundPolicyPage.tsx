import { Link } from 'react-router-dom';

export default function RefundPolicyPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-[#111] py-16">
                <div className="container-custom">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                        Garanti ve İade Koşulları
                    </h1>
                    <p className="text-gray-400 mt-4">
                        Para İade Politikası ve Garanti Koşulları
                    </p>
                </div>
            </div>

            <div className="container-custom py-16">
                <div className="max-w-4xl mx-auto">
                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-4">
                            Teslimat Bilgisi
                        </h2>
                        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                            <p className="text-gray-700 leading-relaxed">
                                Hafta içi <strong>16:00</strong> ve Cumartesi <strong>11:00</strong>'den önce verilen siparişler aynı gün Hepsijet veya Aras Kargo ile gönderilir. Teslimat bölgesine bağlı olarak <strong>1-3 iş günü</strong> içerisinde size ulaşmış olur.
                            </p>
                        </div>
                        <p className="text-gray-600 mt-4 text-sm">
                            Tarafımızdan kaynaklanan bir aksilik olması halinde ise size üyelik bilgilerinizden yola çıkılarak haber verilecektir. Bu yüzden üyelik bilgilerinizin eksiksiz ve doğru olması önemlidir. Bayram ve tatil günlerinde teslimat yapılmamaktadır.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-4">
                            Garanti Koşulları
                        </h2>
                        <div className="space-y-4 text-gray-700">
                            <p className="leading-relaxed">
                                Tüm ürünler aksi belirtilmediği takdirde üretici firmaların garantisi altındadır.
                            </p>
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                                <p className="font-medium">
                                    Garanti koşullarının geçerli olabilmesi için kargo teslimatı esnasında ürünü mutlaka kontrol ediniz.
                                </p>
                            </div>
                            <p className="leading-relaxed">
                                Herhangi bir hasar gördüğünüzde tutanak tutturarak ürünü teslim almayınız.
                            </p>
                        </div>

                        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
                            <h3 className="font-bold text-red-800 mb-4">Garanti Kapsamı Dışında Kalan Durumlar:</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>Ürün üzerinde yapılan değişiklikler</li>
                                <li>Ürünün deforme olması</li>
                                <li>Ürünün orijinal dizaynının bozulması</li>
                                <li>Ambalajı açılan ürünlerde iade ve değişim yapılamamaktadır</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-4">
                            İade Koşulları
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                <h3 className="font-bold text-blue-800 mb-4 text-lg">14 Gün Cayma Hakkı</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Ürünü teslim aldıktan sonra <strong>14 gün</strong> içerisinde herhangi bir gerekçe göstermeksizin cayma hakkınızı kullanabilirsiniz.
                                </p>
                            </div>
                            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                                <h3 className="font-bold text-purple-800 mb-4 text-lg">Koşulsuz İade</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Ambalajı açılmamış, kullanılmamış ve orijinal durumundaki ürünler için geri iade garantisi sunuyoruz.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="font-bold mb-4">İade Süreci:</h3>
                            <ol className="list-decimal list-inside space-y-3 text-gray-700">
                                <li>
                                    <span className="font-medium">İletişime Geçin:</span> Müşteri hizmetlerimize e-posta veya telefon ile ulaşın.
                                </li>
                                <li>
                                    <span className="font-medium">Ürünü Hazırlayın:</span> Ürünü orijinal ambalajı ile birlikte fatura ve irsaliye ile paketleyin.
                                </li>
                                <li>
                                    <span className="font-medium">Kargolayın:</span> Belirtilen adrese kargo ile gönderin. (Kargo ücreti alıcıya aittir)
                                </li>
                                <li>
                                    <span className="font-medium">İade Onayı:</span> Ürün kontrolü yapıldıktan sonra 14 gün içinde ücret iadesi yapılır.
                                </li>
                            </ol>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-4">
                            İade Adresi
                        </h2>
                        <div className="bg-gray-100 p-6 rounded-lg">
                            <p className="font-bold text-lg mb-2">OJS Nutrition Gıda A.Ş.</p>
                            <p className="text-gray-700">Ostim OSB Mah. Uzayçağı Cad. No:90</p>
                            <p className="text-gray-700">Yenimahalle / ANKARA</p>
                            <p className="text-gray-700 mt-2">
                                <strong>Tel:</strong> 0850 303 29 89
                            </p>
                            <p className="text-gray-700">
                                <strong>E-posta:</strong> info@ojsnutrition.com
                            </p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-4">
                            İade Edilemeyecek Ürünler
                        </h2>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 font-bold">✕</span>
                                    Ambalajı açılmış, kullanılmış veya tahrip edilmiş ürünler
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 font-bold">✕</span>
                                    Tek kullanımlık ürünler
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 font-bold">✕</span>
                                    Hijyenik ürünler
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 font-bold">✕</span>
                                    Kişiye özel hazırlanmış ürünler
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-500 font-bold">✕</span>
                                    Çabuk bozulabilir veya son kullanma tarihi geçmiş ürünler
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-lg">
                            <h2 className="text-2xl font-black uppercase mb-4">
                                %100 Memnuniyet Garantisi
                            </h2>
                            <p className="leading-relaxed mb-4">
                                OJS Nutrition olarak müşteri memnuniyetini ön planda tutuyoruz. Herhangi bir sorun yaşamanız durumunda bizimle iletişime geçtiğinizde çözüme kavuşturacağız.
                            </p>
                            <Link
                                to="/iletisim"
                                className="inline-block bg-white text-green-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Bize Ulaşın
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
