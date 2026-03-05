import { Link } from 'react-router-dom';

export default function KVKKPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-[#111] py-16">
                <div className="container-custom">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                        KVKK
                    </h1>
                    <p className="text-gray-400 mt-4">
                        Kişisel Verilerin Korunması Kanunu
                    </p>
                </div>
            </div>

            <div className="container-custom py-16">
                <div className="max-w-4xl mx-auto">
                    <section className="mb-12">
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                            <p className="text-gray-700 leading-relaxed">
                                6698 sayılı Kişisel Verilerin Korunması Kanunu'na istinaden şirketimizce benimsenen Kişisel Verileri Koruma Politikası metni aşağıda yer almaktadır.
                            </p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-4">
                            Kişisel Verilerin Korunması Politikası
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-lg mb-3">1. Amaç</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Bu politika, OJS Nutrition Gıda A.Ş. tarafından işlenen kişisel verilerin korunması ve işlenmesine ilişkin usul ve esasları belirlemek amacıyla hazırlanmıştır.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg mb-3">2. Kapsam</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Bu politika, OJS Nutrition müşterileri, çalışanları, tedarikçileri ve iş ortaklarına ait kişisel verilerin işlenmesini kapsamaktadır.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg mb-3">3. Tanımlar</h3>
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <ul className="space-y-3 text-gray-700">
                                        <li>
                                            <strong>Kişisel Veri:</strong> Kimliği belirli veya belirlenebilir gerçek kişiye ilişkin her türlü bilgi.
                                        </li>
                                        <li>
                                            <strong>İlgili Kişi:</strong> Kişisel verisi işlenen gerçek kişi.
                                        </li>
                                        <li>
                                            <strong>Veri Sorumlusu:</strong> Kişisel verilerin işleme amaçlarını ve vasıtalarını belirleyen, veri kayıt sisteminin kurulmasından ve yönetilmesinden sorumlu olan gerçek veya tüzel kişi.
                                        </li>
                                        <li>
                                            <strong>Veri İşleyen:</strong> Veri sorumlusunun verdiği yetkiye dayanarak onun adına kişisel verileri işleyen gerçek veya tüzel kişi.
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg mb-3">4. Kişisel Veri İşleme İlkeleri</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <span className="font-medium text-green-800">Hukuka ve dürüstlük kurallarına uygun olma</span>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <span className="font-medium text-green-800">Doğru ve gerektiğinde güncel olma</span>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <span className="font-medium text-green-800">Belirli, açık ve meşru amaçlar için işlenme</span>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <span className="font-medium text-green-800">İşlendikleri amaçla bağlantılı, sınırlı ve ölçülü olma</span>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 md:col-span-2">
                                        <span className="font-medium text-green-800">İlgili mevzuatta öngörülen veya işlendikleri amaç için gerekli olan süre kadar muhafaza edilme</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg mb-3">5. Kişisel Veri İşleme Şartları</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li>İlgili kişinin açık rızasının bulunması</li>
                                    <li>Kanunlarda açıkça öngörülmesi</li>
                                    <li>Fiili imkânsızlık nedeniyle rızasını açıklayamayacak durumda bulunan kişinin hayatı veya beden bütünlüğünün korunması için zorunlu olması</li>
                                    <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması</li>
                                    <li>Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması</li>
                                    <li>İlgili kişinin kendisi tarafından alenileştirilmiş olması</li>
                                    <li>Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması</li>
                                    <li>İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-lg mb-3">6. İlgili Kişinin Hakları</h3>
                                <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <span className="text-purple-600 font-bold">✓</span>
                                            Kişisel veri işlenip işlenmediğini öğrenme
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-purple-600 font-bold">✓</span>
                                            Kişisel verileri işlenmişse buna ilişkin bilgi talep etme
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-purple-600 font-bold">✓</span>
                                            Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-purple-600 font-bold">✓</span>
                                            Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-purple-600 font-bold">✓</span>
                                            Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-purple-600 font-bold">✓</span>
                                            Kişisel verilerin silinmesini veya yok edilmesini isteme
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-purple-600 font-bold">✓</span>
                                            İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-purple-600 font-bold">✓</span>
                                            Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-4">
                            Çerez Aydınlatma Metni
                        </h2>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Web sitemizde, kullanıcı deneyimini iyileştirmek ve size daha iyi hizmet sunabilmek amacıyla çerezler kullanılmaktadır.
                            </p>
                            <h3 className="font-bold mb-3">Kullanılan Çerez Türleri:</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li><strong>Zorunlu Çerezler:</strong> Web sitesinin düzgün çalışması için gerekli çerezler</li>
                                <li><strong>Performans Çerezleri:</strong> Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olan çerezler</li>
                                <li><strong>İşlevsellik Çerezleri:</strong> Tercihlerinizi hatırlamamızı sağlayan çerezler</li>
                                <li><strong>Hedefleme/Reklam Çerezleri:</strong> İlgi alanlarınıza uygun reklamlar göstermek için kullanılan çerezler</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-4">
                            İlgili Kişi Başvuru Formu
                        </h2>
                        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında haklarınızı kullanmak için aşağıdaki iletişim bilgilerini kullanabilirsiniz.
                            </p>
                            <div className="bg-white p-4 rounded-lg">
                                <p className="font-bold mb-2">İletişim Bilgileri:</p>
                                <p className="text-gray-700">E-posta: kvkk@ojsnutrition.com</p>
                                <p className="text-gray-700">Adres: Ostim OSB Mah. 1268 Cadde No:11 Yenimahalle ANKARA</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-lg text-center">
                            <h2 className="text-2xl font-black uppercase mb-4">
                                Sorularınız mı var?
                            </h2>
                            <p className="mb-6">
                                KVKK ile ilgili sorularınız için bizimle iletişime geçebilirsiniz.
                            </p>
                            <Link
                                to="/iletisim"
                                className="inline-block bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                İletişime Geç
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
