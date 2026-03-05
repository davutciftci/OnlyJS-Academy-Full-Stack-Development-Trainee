import { Link } from 'react-router-dom';

export default function SalesAgreementPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-[#111] py-16">
                <div className="container-custom">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                        Satış Sözleşmesi
                    </h1>
                    <p className="text-gray-400 mt-4">
                        Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu
                    </p>
                </div>
            </div>

            <div className="container-custom py-16">
                <div className="max-w-4xl mx-auto prose prose-lg">
                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase mb-8 border-b-2 border-black pb-4">
                            Ön Bilgilendirme Formu
                        </h2>

                        <h3 className="text-xl font-bold mt-8 mb-4">Madde 1. Taraflar</h3>
                        <div className="bg-gray-50 p-6 rounded-lg mb-6">
                            <h4 className="font-bold mb-4">1.1. Satıcı</h4>
                            <table className="w-full text-sm">
                                <tbody>
                                    <tr className="border-b">
                                        <td className="py-2 font-medium w-1/3">Adı</td>
                                        <td className="py-2">OJS Nutrition Gıda Anonim Şirketi</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 font-medium">Adresi</td>
                                        <td className="py-2">Ostim OSB Mah. 1268 Cadde No:11 Yenimahalle ANKARA</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 font-medium">Telefon</td>
                                        <td className="py-2">0850 303 29 89</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-2 font-medium">Mersis No</td>
                                        <td className="py-2">0733 0889 2340 0001</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 font-medium">E-posta</td>
                                        <td className="py-2">info@ojsnutrition.com</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="text-xs text-gray-500 mt-4 italic">
                                *OJS Nutrition Gıda Anonim Şirketi sözleşmede "SATICI" olarak anılacaktır.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg mb-6">
                            <h4 className="font-bold mb-4">1.2. Alıcı</h4>
                            <p className="text-sm text-gray-600">
                                Alıcı bilgileri sipariş sırasında sisteme girilen bilgilerden oluşmaktadır.
                            </p>
                            <p className="text-xs text-gray-500 mt-4 italic">
                                *Alıcı sözleşmede "ALICI" olarak anılacaktır.
                            </p>
                        </div>

                        <h3 className="text-xl font-bold mt-8 mb-4">Madde 2. Konu</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait internet sitesinden elektronik ortamda siparişini yaptığı ürün/ürünlerin satışı ve teslimi ile ilgili olarak 4077 sayılı Tüketicilerin Korunması Hakkındaki Kanun, 27.11.2014 tarihinde yürürlüğe giren 29188 sayılı Mesafeli Sözleşmelere Dair Yönetmelik hükümleri ve 23.08.2022 tarihinde Resmi Gazete'de yayımlanan Mesafeli Sözleşmeler Yönetmeliğinde Değişiklik Yapılmasına Dair Yönetmelik gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
                        </p>

                        <h3 className="text-xl font-bold mt-8 mb-4">Madde 3. Sözleşme Konusu Ürün</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Elektronik ortamda alınan ürün/ürünlerin cinsi ve türü, miktarı, marka/modeli, satış bedeli, ödeme şekli, teslim alacak kişi, teslimat adresi, fatura bilgileri, kargo ücreti sipariş sayfasında belirtildiği gibidir. Fatura edilecek kişi ile sözleşmeyi yapan kişi aynı olmak zorundadır.
                        </p>

                        <h3 className="text-xl font-bold mt-8 mb-4">Madde 4. Satıcının Hak ve Yükümlülükleri</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            SATICI, 4077 sayılı Tüketicilerin Korunması Hakkındaki Kanun, Mesafeli Sözleşmelere Dair Yönetmelik hükümleri uyarınca sözleşmede kendisine yüklenen edimleri mücbir haller dışında eksiksiz yerine getirmeyi kabul ve taahhüt eder.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Sistem hatalarından meydana gelen fiyat yanlışlıklarından site sorumlu değildir. SATICI, internet sitesindeki sistemden, dizayndan veya yasadışı yollarla internet sitesine yapılabilecek müdahaleler sebebiyle ortaya çıkabilecek tanıtım, fiyat hatalarından sorumlu değildir.
                        </p>

                        <h3 className="text-xl font-bold mt-8 mb-4">Madde 5. Alıcının Hak ve Yükümlülükleri</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            ALICI, ön bilgilendirme formu ve mesafeli satış sözleşmesinde kendisine yüklenen edimleri mücbir sebepler dışında eksiksiz yerine getirmeyi kabul ve taahhüt eder. ALICI, sipariş vermekle birlikte iş sözleşme hükümlerini kabul etmiş sayıldığını ve sözleşmede belirtilen ödeme şekline uygun ödemeyi yapacağını kabul ve taahhüt eder.
                        </p>

                        <h3 className="text-xl font-bold mt-8 mb-4">Madde 6. Sipariş/Ödeme Prosedürü</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Siteden kredi kartı (Visa, MasterCard vb.) ile veya anlaşmalı kargo firmalarının sunacağı kapıda nakit/kartla ödeme ile satın alım işlemi yapılabilmektedir. Havale ya da posta çeki gibi müşteri hizmetleri ile görüşülmeden gerçekleştirilen ödeme yöntemleri kabul edilmez.
                        </p>

                        <h3 className="text-xl font-bold mt-8 mb-4">Madde 7. Sevkiyat/Teslimat Prosedürü</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Hafta içi 16:00 ve Cumartesi 11:00'den önce verilen siparişler aynı gün kargo ile gönderilir. Teslimat bölgesine bağlı olarak 1-3 iş günü içerisinde size ulaşmış olur.
                        </p>

                        <h3 className="text-xl font-bold mt-8 mb-4">Madde 8. Ürün İade ve Cayma Hakkına İlişkin Prosedür</h3>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                            <h4 className="font-bold mb-2">8.1. Ürün Teslimi Sonrasında Kullanılacak Cayma Hakkı</h4>
                            <p className="text-gray-700 text-sm">
                                ALICI malı teslim aldıktan sonra <strong>ondört (14) gün</strong> içerisinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
                            </p>
                        </div>
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                            <h4 className="font-bold mb-2">8.2. Kargo Şirketine Teslim Öncesi Cayma Hakkı</h4>
                            <p className="text-gray-700 text-sm">
                                ALICI, sözleşmenin kurulmasından ürünlerin kargo şirketine teslimine kadar olan süre içinde de cayma hakkını kullanabilir.
                            </p>
                        </div>

                        <h3 className="text-xl font-bold mt-8 mb-4">Madde 9. Cayma Hakkının Kullanılamayacağı Haller</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                            <li>Ambalajı açılmış ürünlerde iade ve değişim yapılamamaktadır.</li>
                            <li>Tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan ürünler.</li>
                            <li>Çabuk bozulabilen veya son kullanma tarihi geçebilecek ürünler.</li>
                            <li>Tek kullanımlık ürünler ile hijyenik ürünler.</li>
                        </ul>

                        <h3 className="text-xl font-bold mt-8 mb-4">Madde 10. Mücbir Nedenler</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Sözleşmenin imzalandığı tarihte mevcut olmayan veya öngörülmeyen, tarafların kontrolleri dışında gelişen, ortaya çıkmasıyla taraflardan birinin ya da her ikisinin de sözleşme ile yüklendikleri borç ve sorumluluklarını kısmen ya da tamamen yerine getirmelerini ya da bunları zamanında yerine getirmelerini olanaksızlaştıran durumlar, mücbir sebep olarak değerlendirilir.
                        </p>

                        <h3 className="text-xl font-bold mt-8 mb-4">Madde 11. Kampanya Koşulları</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Kampanyalar, belirtilen tarih ve koşullar dahilinde geçerlidir. Kampanya koşulları önceden haber verilmeksizin değiştirilebilir veya sonlandırılabilir.
                        </p>

                        <h3 className="text-xl font-bold mt-8 mb-4">Madde 12. Gizlilik ve Kişisel Veriler</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            SATICI, ALICI'ya ait kişisel verileri 6698 sayılı Kişisel Verilerin Korunması Kanunu ve ilgili mevzuat kapsamında işlemektedir. Detaylı bilgi için{' '}
                            <Link to="/kvkk" className="text-blue-600 hover:underline">KVKK Politikası</Link> sayfasını inceleyebilirsiniz.
                        </p>

                        <h3 className="text-xl font-bold mt-8 mb-4">Madde 13. Uyuşmazlık Durumunda Yetkili Mahkeme</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığınca ilan edilen değere kadar tüketici hakem heyetleri, bu değeri aşan durumlarda tüketici mahkemeleri yetkilidir.
                        </p>

                        <h3 className="text-xl font-bold mt-8 mb-4">Madde 14. Kabul ve Onay Beyanı</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            ALICI, işbu sözleşme ve ön bilgilendirme formunu okuduğunu, anladığını ve kabul ettiğini beyan eder. Sipariş onayı ile birlikte sözleşme kurulmuş sayılır.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-8 border-b-2 border-black pb-4">
                            Mesafeli Satış Sözleşmesi
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Yukarıda yer alan Ön Bilgilendirme Formu'ndaki tüm maddeler, Mesafeli Satış Sözleşmesi için de geçerlidir. ALICI, sipariş onayı ile birlikte işbu sözleşmenin tüm hükümlerini kabul etmiş sayılır.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
