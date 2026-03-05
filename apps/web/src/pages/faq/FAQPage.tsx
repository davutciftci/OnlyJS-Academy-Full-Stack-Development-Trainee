import { useState } from 'react';
import { ShoppingBag, Truck, Plus, Minus } from 'lucide-react';
import { FaRegCreditCard } from 'react-icons/fa';
import ContactPage from '../contact/ContactPage';

type FAQCategory = 'genel' | 'urunler' | 'kargo';

interface FAQ {
    question: string;
    answer: string;
    category: FAQCategory;
}

const faqs: FAQ[] = [
    
    {
        question: "OJS Nutrition ürünlerinin menşei neresi?",
        answer: "OJS Nutrition ürünleri Türkiye'de üretilmektedir. Tüm ürünlerimiz laboratuvar testlidir ve kalite standartlarına uygun olarak üretilmektedir.",
        category: 'genel'
    },
    {
        question: "Hangi sertifikalarınız var?",
        answer: "Ürünlerimiz ISO 9001, GMP ve HACCP sertifikalarına sahiptir. Ayrıca tüm ürünlerimiz bağımsız laboratuvarlarda test edilmektedir.",
        category: 'genel'
    },
    {
        question: "Satılan ürünler garantili midir? Değişim var mı?",
        answer: "Evet, tüm ürünlerimiz memnuniyet garantisi altındadır. Herhangi bir sorun yaşamanız durumunda ürün değişimi veya iade işleminizi gerçekleştirebilirsiniz.",
        category: 'genel'
    },
    {
        question: "Sipariş verirken sorun yaşıyorum, ne yapmam gerekir?",
        answer: "Sipariş verirken sorun yaşıyorsanız, müşteri hizmetlerimizle iletişime geçerek sorununuzu çözebilirsiniz.",
        category: 'genel'
    },
    {
        question: "OJS Nutrition ürünleri nerede satılıyor?",
        answer: "OJS Nutrition ürünleri sadece resmi web sitemiz üzerinden satılmaktadır. Bu sayede ürünlerimizin orijinalliğini garanti ediyoruz.",
        category: 'genel'
    },
    {
        question: "Yüksek proteinli ürünleri kimler kullanabilir?",
        answer: "Protein ürünleri spor yapan herkes tarafından kullanılabilir. Ancak özel sağlık durumunuz varsa doktorunuza danışmanızı öneririz.",
        category: 'genel'
    },
    {
        question: "Taksit seçeneği neden yok?",
        answer: "Şu an için taksit seçeneği bulunmamaktadır. Ancak yakın zamanda bu özelliği ekleyeceğiz.",
        category: 'genel'
    },
    {
        question: "Siparişimi nasıl iptal edebilirim?",
        answer: "Siparişiniz kargoya verilmeden önce müşteri hizmetlerimizle iletişime geçerek iptal edebilirsiniz.",
        category: 'genel'
    },
    {
        question: "Kapağın altındaki fölya açılmış veya tam yapışmamış gibi duruyor?",
        answer: "Ürünlerimiz fabrikadan çıktığı gibi size ulaşmaktadır. Fölya açılmış gibi görünse de bu üretim sürecinin doğal bir sonucudur.",
        category: 'genel'
    },
    {
        question: "Satığınız ürünler ilaç mıdır?",
        answer: "Hayır, ürünlerimiz gıda takviyesidir, ilaç değildir.",
        category: 'genel'
    },
    {
        question: "Siparişimi teslim alırken nelere dikkat etmeliyim?",
        answer: "Kargo görevlisinden paketi teslim alırken dış ambalajın hasarlı olup olmadığını kontrol ediniz. Hasar varsa tutanak tutunuz.",
        category: 'genel'
    },
    {
        question: "Kapıda ödeme hizmetiniz var mı?",
        answer: "Hayır, şu an için kapıda ödeme seçeneğimiz bulunmamaktadır.",
        category: 'genel'
    },
    {
        question: "Sipariş takibimi nasıl yapabilirim?",
        answer: "Siparişiniz kargoya verildikten sonra e-posta ve SMS ile kargo takip numaranız tarafınıza iletilecektir.",
        category: 'genel'
    },
    {
        question: "İptal ve iade etiğin ürünlerin tutarı hesabıma ne zaman aktarır?",
        answer: "İade işleminiz onaylandıktan sonra 3-5 iş günü içerisinde ödeme yaptığınız hesaba iade edilir.",
        category: 'genel'
    },

    
    {
        question: "Ürünlerinizin son kullanma tarihi ne kadar?",
        answer: "Tüm ürünlerimizin son kullanma tarihi en az 12 aydır. Her ürünün üzerinde son kullanma tarihi belirtilmiştir.",
        category: 'urunler'
    },
    {
        question: "Ürünleriniz laboratuvar testli mi?",
        answer: "Evet, tüm ürünlerimiz bağımsız laboratuvarlarda test edilmekte ve sertifikalandırılmaktadır.",
        category: 'urunler'
    },
    {
        question: "Whey Protein nasıl kullanılır?",
        answer: "Whey Protein antrenman sonrası 1-2 ölçek (30-60g) su veya süt ile karıştırılarak tüketilebilir.",
        category: 'urunler'
    },
    {
        question: "Kreatin nasıl kullanılmalı?",
        answer: "Kreatin günde 5g olarak su ile karıştırılarak tüketilebilir. Yükleme fazı yapılmasına gerek yoktur.",
        category: 'urunler'
    },
    {
        question: "BCAA ne zaman kullanılmalı?",
        answer: "BCAA antrenman öncesi, sırası veya sonrasında kullanılabilir. Günde 5-10g tüketim önerilir.",
        category: 'urunler'
    },
    {
        question: "Pre-Workout yan etkisi var mı?",
        answer: "Pre-Workout ürünleri önerilen dozda kullanıldığında yan etkisi yoktur. Ancak kafein hassasiyeti olanlar dikkatli kullanmalıdır.",
        category: 'urunler'
    },
    {
        question: "Collagen hangi yaştan itibaren kullanılabilir?",
        answer: "Collagen 18 yaş üzeri herkes tarafından kullanılabilir. Cilt, eklem ve saç sağlığı için faydalıdır.",
        category: 'urunler'
    },
    {
        question: "Vitamin paketleri nasıl kullanılır?",
        answer: "Günlük vitamin paketleri sabah kahvaltıdan sonra 1 paket olarak tüketilmelidir.",
        category: 'urunler'
    },

    
    {
        question: "Kargo ücreti ne kadar?",
        answer: "Tüm siparişlerinizde kargo ücretsizdir.",
        category: 'kargo'
    },
    {
        question: "Aynı gün kargo hangi saatlerde geçerli?",
        answer: "Hafta içi 16:00'ya, Cumartesi günleri 11:00'e kadar verilen siparişler aynı gün kargoya verilir.",
        category: 'kargo'
    },
    {
        question: "Kargo ne kadar sürede teslim edilir?",
        answer: "Kargo süresi bölgenize göre 1-3 iş günü arasında değişmektedir.",
        category: 'kargo'
    },
    {
        question: "Hangi kargo firması ile çalışıyorsunuz?",
        answer: "Siparişleriniz Yurtiçi Kargo, Aras Kargo ve MNG Kargo ile gönderilmektedir.",
        category: 'kargo'
    },
    {
        question: "Kargo takip numaramı nasıl öğrenebilirim?",
        answer: "Siparişiniz kargoya verildikten sonra e-posta ve SMS ile kargo takip numaranız tarafınıza iletilir.",
        category: 'kargo'
    },
    {
        question: "Yurtdışına kargo gönderiyor musunuz?",
        answer: "Şu an için sadece Türkiye içerisine kargo gönderimi yapmaktayız.",
        category: 'kargo'
    },
    {
        question: "Kargom hasarlı gelirse ne yapmalıyım?",
        answer: "Kargo hasarlı geldiğinde kargo görevlisinden tutanak tutarak paketi teslim almayınız ve bizimle iletişime geçiniz.",
        category: 'kargo'
    },
];

const FAQPage = () => {
    const [activeCategory, setActiveCategory] = useState<FAQCategory>('genel');
    const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set());

    const filteredFAQs = faqs.filter(faq => faq.category === activeCategory);

    const toggleQuestion = (index: number) => {
        const newOpenQuestions = new Set(openQuestions);
        if (newOpenQuestions.has(index)) {
            newOpenQuestions.delete(index);
        } else {
            newOpenQuestions.add(index);
        }
        setOpenQuestions(newOpenQuestions);
    };

    const getCategoryIcon = () => {
        switch (activeCategory) {
            case 'genel':
                return <FaRegCreditCard className="w-5 h-5 text-black" />;
            case 'urunler':
                return <ShoppingBag className="w-5 h-5 text-black" />;
            case 'kargo':
                return <Truck className="w-5 h-5 text-black" />;
        }
    };

    const getCategoryText = () => {
        switch (activeCategory) {
            case 'genel':
                return 'GENEL';
            case 'urunler':
                return 'ÜRÜNLER';
            case 'kargo':
                return 'KARGO';
        }
    };

    return (
        <div className="bg-white min-h-screen">
            {}
            <div className="container-custom mx-auto px-4 py-12">
                {}
                <div className="flex gap-3 mb-8 border-b">
                    <button
                        onClick={() => setActiveCategory('genel')}
                        className={`px-6 py-2.5 rounded-sm text-sm font-semibold uppercase transition-colors ${activeCategory === 'genel'
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-black border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Genel
                    </button>
                    <button
                        onClick={() => setActiveCategory('urunler')}
                        className={`px-6 py-2.5 rounded-sm text-sm font-semibold uppercase transition-colors ${activeCategory === 'urunler'
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-black border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Ürünler
                    </button>
                    <button
                        onClick={() => setActiveCategory('kargo')}
                        className={`px-6 py-2.5 rounded-sm text-sm font-semibold uppercase transition-colors ${activeCategory === 'kargo'
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-black border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Kargo
                    </button>
                </div>

                {}
                <div className="flex items-center gap-2 mb-6">
                    <div className="text-blue-600">
                        {getCategoryIcon()}
                    </div>
                    <h2 className="text-lg font-bold uppercase tracking-wide">
                        {getCategoryText()}
                    </h2>
                </div>

                {}
                <div className="border-[1px] border-gray-100 md:border-4 md:border-gray-200">
                    {filteredFAQs.map((faq, index) => (
                        <div
                            key={index}
                            className="border-[1px] border-gray-100 md:border-4 md:border-gray-200 overflow-hidden bg-white"
                        >
                            <button
                                onClick={() => toggleQuestion(index)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-medium text-gray-900 ">
                                    {faq.question}
                                </span>
                                {openQuestions.has(index) ? (
                                    <Minus className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                ) : (
                                    <Plus className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                )}
                            </button>
                            {openQuestions.has(index) && (
                                <div className="px-4 pb-4 pt-0">
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {}
            <div className="max-w-2xl mx-auto">
                <ContactPage hideHeaderAndFooter={true} />
            </div>
        </div>
    );
};

export default FAQPage;
