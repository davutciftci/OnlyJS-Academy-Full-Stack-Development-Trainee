export default function WorkPrinciplesPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-[#111] py-16">
                <div className="container-custom">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                        Çalışma İlkelerimiz
                    </h1>
                    <p className="text-gray-400 mt-4">
                        OJS Nutrition İş Etiği Politikası
                    </p>
                </div>
            </div>

            <div className="container-custom py-16">
                <div className="max-w-4xl mx-auto">
                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-4">
                            İçindekiler
                        </h2>
                        <nav className="bg-gray-50 p-6 rounded-lg">
                            <ol className="space-y-2 text-gray-700">
                                <li className="font-medium">1. İş Etiği Kuralları Genel Bilgi</li>
                                <li className="font-medium">2. Çalışan ve Çalışan Adayları Yönünden Etik Kurallar</li>
                                <li className="font-medium">3. İş Ahlakı ve Çalışma İlkeleri</li>
                                <li className="font-medium">4. Politika İhlalleri Halinde Uygulanacak Esaslar</li>
                                <li className="font-medium">5. Etik Kurulu</li>
                            </ol>
                        </nav>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-4">
                            1. İş Etiği Kuralları Genel Bilgi
                        </h2>

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
                            <h3 className="font-bold text-lg mb-4">1.1 Önsöz</h3>
                            <p className="text-gray-700 leading-relaxed">
                                OJS Nutrition İş Etiği Kuralları, temel ilke ve değerlerimizle uyum sağlayacak şekilde, tüm iş süreçlerimizde bizlere yol göstermesi amacıyla oluşturulmuştur.
                            </p>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                Şirketimiz içinde yürüttüğümüz operasyonlarımızda ve etkileşimde bulunduğumuz tüm müşterilerimiz, tedarikçilerimiz ve çözüm ortaklarımızla, bu rehberde yer alan kurallar çerçevesinde, dürüstlük, güvenilirlik, şeffaflık ve hesap verebilirlik ilkeleri doğrultusunda çalışmayı ve ilişkilerimizi sürdürmeyi taahhüt ediyoruz.
                            </p>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-4">1.2 Değerlerimiz</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['Doğruluk', 'Güven', 'Dürüstlük', 'Öncülük', 'Sürdürülebilirlik', 'Sorumluluk', 'Görev Bilinci'].map((value) => (
                                    <div key={value} className="bg-green-50 p-4 rounded-lg text-center">
                                        <span className="font-medium text-green-800">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-4">1.3 İş Etiği Kuralları</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Etik değerler, yazılı olmayan ahlak kuralları olarak tanımlanmaktadır. İş Etiği Kuralları ise, şirket içi ve dışında nasıl davranacağımız ve karar alacağımız konusunda bize yardımcı olmak üzere yazılı hale getirilmiş standartlar bütünüdür.
                            </p>
                        </div>

                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-4">1.4 Neden Etik Kuralları Uyguluyoruz?</h3>
                            <p className="text-gray-700 leading-relaxed">
                                OJS Nutrition, faaliyetlerini, etkileşimde bulunduğu tüm müşterileri, tedarikçileri ve çözüm ortakları ile olan ilişkilerini, benimsemiş olduğu etik değerlere uygun olarak gerçekleştirmeyi taahhüt etmektedir.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h4 className="font-bold mb-3">1.5 Yöneticilerin Sorumlulukları</h4>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    İş Etiği Kuralları'nın uygulamaya konması ve uygulanmasında liderlik etmek yöneticilerimizin öncelikli sorumlulukları arasındadır.
                                </p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h4 className="font-bold mb-3">1.6 Çalışanların Sorumlulukları</h4>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Çalışanlarımızın, bu rehberde yer alan kuralları okuyup, anlaması ve uygulamasını beklemekteyiz.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-4">
                            2. Çalışan ve Çalışan Adayları Yönünden Etik Kurallar
                        </h2>

                        <div className="space-y-6">
                            <div className="border-l-4 border-purple-500 pl-6">
                                <h3 className="font-bold text-lg mb-2">2.1 İşe Alım Süreci</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    OJS Nutrition olarak, işe alım sırasında adaylara eşit fırsat tanırız. Hiçbir şekilde ırk, renk, cinsiyet, din, dil, medeni hal, cinsel yönelim, cinsiyet kimliği, politik görüş, etnik kimlik, sağlık durumu, ailevi sorumluluklar, sendikal etkinlik ya da üyelik, fiziksel engellilik ya da yaş gibi etkenlere dayalı ayrımcılık yapılmaz.
                                </p>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-6">
                                <h3 className="font-bold text-lg mb-2">2.2 Çalışma Koşulları</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Çalışanlarımızın temel insan hakları ve kanunlarından faydalanmalarını sağlamak, her zaman önceliklerimiz arasındadır. Çalışma saatleri, izin süreleri ve dinlenme süreleri, İş Kanunu'na uygun olarak belirlenmiş olup, iş sözleşmelerinde ayrıntılı olarak düzenlenmiştir.
                                </p>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-6">
                                <h3 className="font-bold text-lg mb-2">2.3 Sosyal Diyalog</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Faaliyet planı ve iş akışı düzenlemelerine tüm çalışanlarımız önceden belirlenmiş olan ekipler içerisinde çalışmaktadır. Şirketimizde faaliyet gösteren İnsan kaynakları temsilcilerimiz şirketimiz yönetimi ve çalışanlar arasında etkin bir diyalog kurulmasını sağlamaktadır.
                                </p>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-6">
                                <h3 className="font-bold text-lg mb-2">2.4 Eğitim</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Çalışanlarımıza eşit eğitim hakkı tanıyoruz. Çalışanların faaliyet gösterdikleri süreçlere yönelik eğitim almaları sağlanarak, performanslarına katkıda bulunulmaktadır.
                                </p>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-6">
                                <h3 className="font-bold text-lg mb-2">2.5 Çeşitlilik, Ayrımcılık ve Taciz</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    OJS Nutrition olarak, çeşitliliğe, farklı bakış açılarına, yetenek ve deneyimlere değer verir, çalışanlarımızı da bu konuda teşvik ederiz. Şirketimizde fiziksel, psikolojik şiddet, sözlü taciz veya cinsel istismara kesinlikle müsade edilmez.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-4">
                            3. İş Ahlakı ve Çalışma İlkeleri
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                                <h3 className="font-bold text-red-800 mb-3">3.1 Yolsuzlukla Mücadele ve Rüşvet</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Yolsuzluğa ve rüşvete karşı ulusal ve uluslararası yasalara uygun olarak, şirket içi ve dışındaki tüm ilişkilerimizde dürüstlük ve adalet standartlarını karşılamayı taahhüt ederiz.
                                </p>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                <h3 className="font-bold text-blue-800 mb-3">3.2 Adil Rekabet</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Rekabetçi bir pazarın varlığının öneminin bilincinde, gerçekleştirdiğimiz tüm faaliyet ve operasyonlarda rekabet ve şeffaflık ile ilgili tüm kural ve düzenlemelere uymayı taahhüt ediyoruz.
                                </p>
                            </div>

                            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                                <h3 className="font-bold text-yellow-800 mb-3">3.3 Çıkar Çatışması</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Çıkar çatışması kurum kimliğini ve itibarını olumsuz yönde etkileyebilecek bir husustur. Çalışanlar, kendilerine veya üçüncü taraflara ait herhangi bir çıkar çatışmasından kaçınmalıdır.
                                </p>
                            </div>

                            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                <h3 className="font-bold text-green-800 mb-3">3.4 Hediyeler ve Davetler</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Üçüncü taraflarla olan ilişkilerimizin profesyonel olmasını ve iş kararlarını etkilememesini önemsemekteyiz.
                                </p>
                            </div>

                            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                                <h3 className="font-bold text-purple-800 mb-3">3.5 Sivil Toplum Kuruluşları</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Sivil toplum kuruluşları ve siyasi faaliyetlere katılım konusunda şirket politikalarına uyulması gerekmektedir.
                                </p>
                            </div>

                            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                                <h3 className="font-bold text-indigo-800 mb-3">3.6 Bilgi Güvenliği ve KVKK</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Kişisel verilerin korunması ve bilgi güvenliği konusunda tüm yasal düzenlemelere uyum sağlanmaktadır.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-4">
                            4. Politika İhlalleri Halinde Uygulanacak Esaslar
                        </h2>
                        <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
                            <h3 className="font-bold mb-4">4.1 Etik Açıdan İhlal Tespit Değerlendirmesi</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Kuralların ihlal edildiğinden şüphe duyan veya buna şahit olan çalışanlarımızın en kısa zamanda Etik Kurulu'na durumu raporlaması gerekmektedir.
                            </p>
                            <h3 className="font-bold mb-4">4.2 İhlal Halinde Uyuşmazlık Çözümü</h3>
                            <p className="text-gray-700 leading-relaxed">
                                İhlal durumlarında gerekli soruşturma yapılarak, uygun yaptırımlar uygulanır.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black uppercase mb-6 border-b-2 border-black pb-4">
                            5. Etik Kurulu
                        </h2>
                        <div className="bg-gray-100 p-6 rounded-lg">
                            <h3 className="font-bold mb-4">5.1 Kurul</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                OJS Nutrition Etik Kurulu, şirket içindeki etik standartların korunması ve geliştirilmesinden sorumludur.
                            </p>
                            <h3 className="font-bold mb-4">5.2 Etik Kurulu Çalışma İlkeleri</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Kurul, bağımsızlık, gizlilik ve tarafsızlık ilkeleri çerçevesinde çalışır.
                            </p>
                            <h3 className="font-bold mb-4">5.3 İhbar Bildirimi</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Etik ihlalleri için bildirim kanalları açık tutulmakta ve ihbarda bulunanların korunması sağlanmaktadır.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
