# 🛒 Protein Shop E-Ticaret Platformu

## Bitirme Projesi Sunumu

**Hazırlayan:** Davut Çiftçi  
**Tarih:** Şubat 2026  
**Proje Türü:** Full-Stack E-Ticaret Platformu

---

## 📋 İçindekiler

1. [Proje Özeti](#proje-özeti)
2. [Proje Hedefleri](#proje-hedefleri)
3. [Teknoloji Stack](#teknoloji-stack)
4. [Sistem Mimarisi](#sistem-mimarisi)
5. [Veritabanı Tasarımı](#veritabanı-tasarımı)
6. [Özellikler ve Fonksiyonlar](#özellikler-ve-fonksiyonlar)
7. [API Yapısı](#api-yapısı)
8. [Güvenlik](#güvenlik)
9. [Demo ve Ekran Görüntüleri](#demo-ve-ekran-görüntüleri)
10. [Sonuç ve Gelecek Planları](#sonuç-ve-gelecek-planları)

---

## 1. Proje Özeti

### 🎯 Nedir?

**Protein Shop**, protein supplement (takviye) ürünlerinin satışını gerçekleştiren modern, tam özellikli bir e-ticaret platformudur.

### 💡 Neden?

- Spor ve fitness sektörü hızla büyüyor
- Online alışveriş talebi artıyor
- Kullanıcı dostu, güvenli bir platform ihtiyacı var
- Modern web teknolojilerini kullanarak gerçek dünya deneyimi kazanmak

### 📊 Kapsam

- **Kullanıcı Tarafı:** Ürün arama, sepet yönetimi, sipariş takibi, yorum yapma
- **Admin Tarafı:** Ürün yönetimi, sipariş yönetimi, kullanıcı yönetimi
- **Tam Stack:** Frontend + Backend + Veritabanı + API

---

## 2. Proje Hedefleri

### 🎓 Eğitsel Hedefler

- ✅ Full-stack geliştirme deneyimi kazanmak
- ✅ Modern web teknolojilerini öğrenmek
- ✅ RESTful API tasarımı ve implementasyonu
- ✅ Veritabanı tasarımı ve yönetimi
- ✅ Authentication ve Authorization
- ✅ State management ve data flow

### 🚀 Teknik Hedefler

- ✅ Responsive ve kullanıcı dostu arayüz
- ✅ Güvenli authentication sistemi
- ✅ Ölçeklenebilir mimari
- ✅ Clean code ve best practices
- ✅ Type-safe development (TypeScript)
- ✅ Production-ready uygulama

### 💼 İş Hedefleri

- ✅ Gerçek dünya e-ticaret senaryolarını çözmek
- ✅ Kullanıcı deneyimini optimize etmek
- ✅ Admin paneli ile kolay yönetim
- ✅ Sipariş takibi ve yönetimi

---

## 3. Teknoloji Stack

### 🎨 Frontend

```
┌─────────────────────────────────────┐
│  React 18.3.1 + TypeScript          │
│  ├─ Vite (Build Tool)               │
│  ├─ React Router DOM (Routing)     │
│  ├─ Tailwind CSS (Styling)         │
│  ├─ Axios (HTTP Client)            │
│  ├─ Context API (State)            │
│  └─ React Hot Toast (Notifications)│
└─────────────────────────────────────┘
```

**Neden Bu Teknolojiler?**

- **React:** Component-based, reusable, performanslı
- **TypeScript:** Type safety, better IDE support, fewer bugs
- **Vite:** Hızlı development, modern build tool
- **Tailwind:** Utility-first, hızlı styling, responsive
- **Context API:** Basit state management, Redux'a gerek yok

### ⚙️ Backend

```
┌─────────────────────────────────────┐
│  Node.js + Express + TypeScript     │
│  ├─ Prisma ORM (Database)          │
│  ├─ PostgreSQL (Database)          │
│  ├─ JWT (Authentication)           │
│  ├─ Bcrypt (Password Hashing)      │
│  ├─ Zod (Validation)               │
│  ├─ Multer (File Upload)           │
│  └─ Nodemailer (Email)             │
└─────────────────────────────────────┘
```

**Neden Bu Teknolojiler?**

- **Express:** Minimal, flexible, industry standard
- **Prisma:** Type-safe ORM, migration support, modern
- **PostgreSQL:** Güçlü, reliable, relational database
- **JWT:** Stateless authentication, scalable
- **Zod:** Runtime validation, TypeScript integration

---

## 4. Sistem Mimarisi

### 🏗️ Genel Mimari

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React Application (Port 5173)                      │   │
│  │  ├─ Pages (Routes)                                  │   │
│  │  ├─ Components (Reusable UI)                        │   │
│  │  ├─ Context (Global State)                          │   │
│  │  └─ Services (API Calls)                            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
                    (Axios - REST API)
┌─────────────────────────────────────────────────────────────┐
│                         SERVER                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Express Application (Port 3000)                    │   │
│  │  ├─ Routes (API Endpoints)                          │   │
│  │  ├─ Controllers (Request Handlers)                  │   │
│  │  ├─ Services (Business Logic)                       │   │
│  │  ├─ Middlewares (Auth, Validation, Error)          │   │
│  │  └─ Validators (Zod Schemas)                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ Prisma ORM
┌─────────────────────────────────────────────────────────────┐
│                       DATABASE                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database                                │   │
│  │  ├─ Users, Products, Orders                         │   │
│  │  ├─ Categories, Variants                            │   │
│  │  ├─ Cart, Reviews, Addresses                        │   │
│  │  └─ Relations and Constraints                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 Request Flow

```
1. User Action (Frontend)
   ↓
2. API Call (Axios)
   ↓
3. Route Handler (Express Router)
   ↓
4. Middleware (Auth, Validation)
   ↓
5. Controller (Request Processing)
   ↓
6. Service (Business Logic)
   ↓
7. Prisma (Database Query)
   ↓
8. PostgreSQL (Data Storage)
   ↓
9. Response (JSON)
   ↓
10. Frontend Update (State/UI)
```

---

## 5. Veritabanı Tasarımı

### 📊 Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    User     │────────▶│   Address    │         │  Category   │
│             │ 1     * │              │         │             │
│ - id        │         │ - id         │         │ - id        │
│ - email     │         │ - userId     │         │ - name      │
│ - password  │         │ - address    │         │ - slug      │
│ - firstName │         │ - city       │         └─────────────┘
│ - lastName  │         │ - phone      │                │
│ - role      │         └──────────────┘                │ 1
└─────────────┘                                         │
       │ 1                                              │
       │                                                ▼ *
       │                                         ┌─────────────┐
       │                                         │   Product   │
       │                                         │             │
       │                                         │ - id        │
       │                                         │ - name      │
       │                                         │ - slug      │
       │                                         │ - price     │
       │                                         │ - categoryId│
       │                                         └─────────────┘
       │                                                │ 1
       │                                                │
       │                                                ▼ *
       │                                         ┌──────────────────┐
       │                                         │ ProductVariant   │
       │                                         │                  │
       │                                         │ - id             │
       │                                         │ - productId      │
       │                                         │ - size           │
       │                                         │ - flavor         │
       │                                         │ - stock          │
       │                                         └──────────────────┘
       │ 1                                              │ 1
       │                                                │
       ▼ *                                              ▼ *
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    Order    │────────▶│  OrderItem   │◀────────│  CartItem   │
│             │ 1     * │              │         │             │
│ - id        │         │ - id         │         │ - id        │
│ - userId    │         │ - orderId    │         │ - userId    │
│ - status    │         │ - variantId  │         │ - variantId │
│ - total     │         │ - quantity   │         │ - quantity  │
│ - createdAt │         │ - price      │         └─────────────┘
└─────────────┘         └──────────────┘
       │ 1
       │
       ▼ *
┌──────────────────┐
│ ProductComment   │
│                  │
│ - id             │
│ - userId         │
│ - productId      │
│ - title          │
│ - rating         │
│ - comment        │
│ - isApproved     │
└──────────────────┘
```

### 🗂️ Ana Tablolar

| Tablo              | Açıklama            | Önemli Alanlar                     |
| ------------------ | ------------------- | ---------------------------------- |
| **User**           | Kullanıcı hesapları | email, password (hashed), role     |
| **Product**        | Ürün kataloğu       | name, slug, price, categoryId      |
| **ProductVariant** | Ürün varyasyonları  | size, flavor, stock, price         |
| **Category**       | Ürün kategorileri   | name, slug, description            |
| **Order**          | Siparişler          | userId, status, totalAmount        |
| **OrderItem**      | Sipariş kalemleri   | orderId, variantId, quantity       |
| **Cart**           | Alışveriş sepeti    | userId                             |
| **CartItem**       | Sepet kalemleri     | cartId, variantId, quantity        |
| **Address**        | Teslimat adresleri  | userId, city, district, address    |
| **ProductComment** | Ürün yorumları      | userId, productId, rating, comment |

---

## 6. Özellikler ve Fonksiyonlar

### 👤 Kullanıcı Özellikleri

#### 🔐 Authentication

- ✅ Kayıt olma (email, şifre, ad-soyad)
- ✅ Giriş yapma (JWT token)
- ✅ Şifre değiştirme
- ✅ Profil güncelleme
- ✅ Otomatik oturum yönetimi

#### 🛍️ Alışveriş

- ✅ Ürün listeleme ve filtreleme
- ✅ Kategori bazlı gezinme
- ✅ Ürün detay sayfası
- ✅ Varyant seçimi (boyut, aroma)
- ✅ Sepete ekleme/çıkarma
- ✅ Sepet yönetimi
- ✅ Checkout süreci

#### 📦 Sipariş Yönetimi

- ✅ Sipariş oluşturma
- ✅ Sipariş geçmişi
- ✅ Sipariş detayları
- ✅ Sipariş durumu takibi
- ✅ Sipariş iptali

#### ⭐ Yorum Sistemi

- ✅ Ürün değerlendirme (1-5 yıldız)
- ✅ Yorum yazma (başlık + içerik)
- ✅ Yorum düzenleme
- ✅ Yorum silme
- ✅ Admin onay sistemi

#### 📍 Adres Yönetimi

- ✅ Birden fazla adres ekleme
- ✅ Varsayılan adres seçimi
- ✅ Adres düzenleme/silme

### 👨‍💼 Admin Özellikleri

#### 📊 Dashboard

- ✅ Genel istatistikler
- ✅ Son siparişler
- ✅ Popüler ürünler

#### 📦 Ürün Yönetimi

- ✅ Ürün ekleme/düzenleme/silme
- ✅ Varyant yönetimi
- ✅ Stok takibi
- ✅ Fiyat güncelleme
- ✅ Resim yükleme

#### 📋 Sipariş Yönetimi

- ✅ Tüm siparişleri görüntüleme
- ✅ Sipariş durumu güncelleme
- ✅ Kargo takip numarası ekleme

#### ✅ Yorum Yönetimi

- ✅ Yorumları onaylama/reddetme
- ✅ Yorum silme

#### 👥 Kullanıcı Yönetimi

- ✅ Kullanıcı listesi
- ✅ Kullanıcı detayları

---

## 7. API Yapısı

### 🔌 RESTful API Endpoints

#### Authentication

```
POST   /auth/register      - Yeni kullanıcı kaydı
POST   /auth/login         - Kullanıcı girişi
GET    /auth/me            - Mevcut kullanıcı bilgisi
```

#### Products

```
GET    /products           - Tüm ürünler (pagination, filter)
GET    /products/:id       - Ürün detayı
POST   /products           - Ürün oluştur (Admin)
PUT    /products/:id       - Ürün güncelle (Admin)
DELETE /products/:id       - Ürün sil (Admin)
```

#### Cart

```
GET    /cart               - Sepeti getir
POST   /cart/items         - Sepete ürün ekle
PUT    /cart/items/:id     - Sepet ürün miktarı güncelle
DELETE /cart/items/:id     - Sepetten ürün çıkar
DELETE /cart               - Sepeti temizle
```

#### Orders

```
GET    /orders/my          - Kullanıcının siparişleri
GET    /orders/:id         - Sipariş detayı
POST   /orders             - Sipariş oluştur
PATCH  /orders/:id/cancel  - Sipariş iptal et
PATCH  /orders/:id/status  - Sipariş durumu güncelle (Admin)
```

#### Reviews

```
GET    /comments/product/:productId  - Ürün yorumları
POST   /comments                     - Yorum oluştur
PATCH  /comments/:id                 - Yorum güncelle
DELETE /comments/:id                 - Yorum sil
PATCH  /comments/:id/approve         - Yorum onayla (Admin)
```

### 📝 API Response Format

**Success Response:**

```json
{
  "status": "success",
  "data": { ... },
  "results": 10,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Error Response:**

```json
{
  "status": "error",
  "message": "Hata mesajı",
  "errors": [ ... ]
}
```

---

## 8. Güvenlik

### 🔒 Güvenlik Özellikleri

#### Authentication & Authorization

- ✅ **JWT Tokens:** Stateless authentication
- ✅ **Password Hashing:** Bcrypt ile şifre hashleme
- ✅ **Role-Based Access:** USER ve ADMIN rolleri
- ✅ **Protected Routes:** Middleware ile korumalı endpoint'ler

#### Data Validation

- ✅ **Zod Validation:** Runtime type checking
- ✅ **Input Sanitization:** XSS koruması
- ✅ **SQL Injection Prevention:** Prisma ORM kullanımı

#### Security Headers

- ✅ **CORS:** Cross-Origin Resource Sharing yapılandırması
- ✅ **Helmet:** Security headers (production için önerilir)

#### Best Practices

- ✅ Environment variables (.env)
- ✅ Sensitive data encryption
- ✅ Error handling (stack trace gizleme)
- ✅ Rate limiting (production için önerilir)

---

## 9. Demo ve Ekran Görüntüleri

### 🏠 Ana Sayfa

- Hero section
- Öne çıkan ürünler
- Kategoriler
- Responsive tasarım

### 🛍️ Ürün Sayfası

- Ürün listesi
- Filtreleme ve sıralama
- Kategori navigasyonu
- Pagination

### 📦 Ürün Detay

- Ürün bilgileri
- Varyant seçimi
- Yorumlar ve puanlar
- Sepete ekleme

### 🛒 Sepet

- Sepet ürünleri
- Miktar güncelleme
- Fiyat hesaplama
- Checkout butonu

### 📋 Sipariş Takibi

- Sipariş listesi
- Sipariş durumu
- Sipariş detayları
- Yorum yapma

### 👨‍💼 Admin Panel

- Dashboard
- Ürün yönetimi
- Sipariş yönetimi
- Yorum onaylama

---

## 10. Sonuç ve Gelecek Planları

### ✅ Başarılanlar

1. **Full-Stack Uygulama:** Baştan sona tüm katmanlar geliştirildi
2. **Modern Teknolojiler:** React, TypeScript, Node.js, PostgreSQL
3. **Clean Architecture:** Katmanlı mimari, separation of concerns
4. **Type Safety:** TypeScript ile end-to-end type safety
5. **Security:** JWT, bcrypt, validation, CORS
6. **User Experience:** Responsive, kullanıcı dostu arayüz
7. **Admin Panel:** Kolay yönetim için admin özellikleri

### 🚀 Gelecek Geliştirmeler

#### Kısa Vadeli

- [ ] Payment gateway entegrasyonu (Stripe, PayPal)
- [ ] Email notifications (sipariş onayı, kargo)
- [ ] Ürün arama özelliği (Elasticsearch)
- [ ] Wishlist (favori ürünler)
- [ ] Kupon ve indirim sistemi

#### Orta Vadeli

- [ ] Real-time notifications (Socket.io)
- [ ] Advanced analytics (Google Analytics)
- [ ] SEO optimization
- [ ] PWA (Progressive Web App)
- [ ] Mobile app (React Native)

#### Uzun Vadeli

- [ ] Multi-language support (i18n)
- [ ] Multi-currency support
- [ ] Vendor/marketplace system
- [ ] AI-powered recommendations
- [ ] Chatbot support

### 📊 Proje İstatistikleri

- **Toplam Kod Satırı:** ~15,000+
- **Geliştirme Süresi:** 3-4 ay
- **Dosya Sayısı:** 100+
- **API Endpoints:** 30+
- **Database Tables:** 15+
- **Components:** 50+

### 💭 Öğrenilenler

1. **Full-Stack Development:** Frontend ve backend entegrasyonu
2. **State Management:** Context API ile global state yönetimi
3. **API Design:** RESTful API best practices
4. **Database Design:** Relational database modeling
5. **Authentication:** JWT-based authentication
6. **TypeScript:** Type-safe development
7. **Error Handling:** Proper error handling ve user feedback
8. **Deployment:** Production-ready application

---

## 🙏 Teşekkürler

Bu proje, modern web development teknolojilerini öğrenmek ve gerçek dünya senaryolarını çözmek için geliştirilmiştir.

**Sorularınız için teşekkürler!**

---

## 📞 İletişim

**Geliştirici:** Davut Çiftçi  
**GitHub:** [github.com/davutciftci](https://github.com/davutciftci)  
**Email:** [your-email@example.com]

---

**Not:** Bu sunum, Protein Shop e-ticaret platformunun teknik ve işlevsel yönlerini kapsamaktadır. Daha detaylı bilgi için teknik dokümantasyona başvurabilirsiniz.
