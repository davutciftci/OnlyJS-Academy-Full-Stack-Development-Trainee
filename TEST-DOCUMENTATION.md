# 🧪 Test Dokümantasyonu

> **Proje:** OnlyJS Academy Full Stack Development Trainee  
> **Frontend Test Çerçevesi:** Vitest + React Testing Library  
> **Backend Test Çerçevesi:** Jest

---

## 📋 İçindekiler

- [Frontend Testleri](#-frontend-testleri)
  - [Sanity Check](#1-sanity-check)
  - [API Endpoints](#2-api-endpoints)
  - [AuthService](#3-authservice)
  - [ProductService](#4-productservice)
  - [AuthContext](#5-authcontext)
  - [CartContext](#6-cartcontext)
  - [Navbar Bileşeni](#7-navbar-bileşeni)
  - [ReviewModal Bileşeni](#8-reviewmodal-bileşeni)
- [Backend Testleri](#-backend-testleri)
  - [Auth / User Service](#1-auth--user-service)
  - [Cart Service](#2-cart-service)
- [Test Özeti](#-test-özeti)

---

## 🖥️ Frontend Testleri

Frontend testleri `frontend/src/__tests__/` dizininde bulunmaktadır.

---

### 1. Sanity Check

**Dosya:** `__tests__/sanity.test.ts`  
**Kategori:** Temel doğrulama

Test ortamının düzgün çalıştığını doğrulayan tek bir kontrol testidir.

| Test Adı              | Açıklama                               | Beklenen Sonuç |
| --------------------- | -------------------------------------- | -------------- |
| `true should be true` | Test altyapısının çalıştığını doğrular | ✅ Geçer       |

---

### 2. API Endpoints

**Dosya:** `__tests__/api/endpoints.test.ts`  
**Kategori:** Birim Testi — URL Yapısı

Uygulamadaki tüm API endpoint URL üreteci fonksiyonlarının doğru URL çıktısı üretip üretmediğini test eder. Herhangi bir HTTP isteği yapılmaz, yalnızca string çıktıları kontrol edilir.

| Test Adı         | Test Edilen Endpoint                            | Beklenen Çıktı                        |
| ---------------- | ----------------------------------------------- | ------------------------------------- |
| Kategori URL'si  | `ENDPOINTS.CATEGORIES.BY_ID(5)`                 | `/categories/5`                       |
| Ürün URL'si      | `ENDPOINTS.PRODUCTS.BY_ID(10)`                  | `/products/10`                        |
| Varyant URL'leri | `ENDPOINTS.VARIANTS.BY_PRODUCT(1)` / `BY_ID(2)` | `/variants/product/1` / `/variants/2` |
| Fotoğraf URL'si  | `ENDPOINTS.PHOTOS.BY_PRODUCT(3)`                | `/photos/product/3`                   |
| Yorum URL'leri   | `ENDPOINTS.COMMENTS.BY_PRODUCT(4)` / `BY_ID(5)` | `/comments/product/4` / `/comments/5` |
| Adres URL'si     | `ENDPOINTS.ADDRESSES.BY_ID(6)`                  | `/addresses/6`                        |
| Sepet URL'si     | `ENDPOINTS.CART.ITEM_BY_ID(7)`                  | `/cart/items/7`                       |
| Sipariş URL'leri | `ENDPOINTS.ORDERS.BY_ID(8)` / `CANCEL(9)`       | `/orders/8` / `/orders/9/cancel`      |
| Ödeme URL'si     | `ENDPOINTS.PAYMENT.STATUS(123)`                 | `/payments/status/123`                |

**Toplam: 9 test**

---

### 3. AuthService

**Dosya:** `__tests__/services/authService.test.ts`  
**Kategori:** Birim Testi — Servis Katmanı  
**Mock'lananlar:** `apiClient` (Axios istemcisi), `setAuthToken`

Kimlik doğrulama servisinin tüm metodlarını test eder. API çağrıları mock'lanarak gerçek ağ bağlantısı yapılmaz.

#### `login` Testleri

| Test            | Senaryo                  | Beklenen Sonuç                              |
| --------------- | ------------------------ | ------------------------------------------- |
| Başarılı giriş  | Geçerli kimlik bilgileri | Token ve kullanıcı nesnesi döner            |
| Hatalı şifre    | API hata döner           | `'Hatalı şifre'` mesajıyla hata fırlatır    |
| Token gelmez    | API boş data döner       | `'Giriş başarısız'` hatasıyla hata fırlatır |
| Boş hata mesajı | API mesajsız hata döner  | Fallback mesajıyla hata fırlatır            |
| Genel ağ hatası | Axios dışı hata          | Orijinal hata fırlatılır                    |

#### `register` Testleri

| Test             | Senaryo                  | Beklenen Sonuç                      |
| ---------------- | ------------------------ | ----------------------------------- |
| Başarılı kayıt   | Geçerli kullanıcı verisi | Token ve kullanıcı döner            |
| Kayıt engellendi | Status `'error'` gelir   | API mesajıyla hata fırlatır         |
| Boş hata mesajı  | Mesajsız API hatası      | `'Kayıt başarısız'` fallback hatası |
| Email kayıtlı    | Çakışma hatası           | `'Email zaten kayıtlı'` hatası      |

#### `verifyEmail` Testleri

| Test               | Senaryo        | Beklenen Sonuç                 |
| ------------------ | -------------- | ------------------------------ |
| Başarılı doğrulama | Geçerli kod    | Token ve kullanıcı döner       |
| Token gelmez       | Boş data       | `'Doğrulama başarısız'` hatası |
| Geçersiz kod       | API hata döner | `'Geçersiz kod'` hatası        |

#### `resendCode` Testleri

| Test              | Senaryo          | Beklenen Sonuç             |
| ----------------- | ---------------- | -------------------------- |
| Başarılı gönderim | Geçerli email    | Hata fırlatmaz             |
| Limit doldu       | Status `'error'` | `'Limit doldu'` hatası     |
| Çok fazla istek   | API hata döner   | `'Çok fazla istek'` hatası |

#### `getCurrentUser` Testleri

| Test           | Senaryo       | Beklenen Sonuç                         |
| -------------- | ------------- | -------------------------------------- |
| Başarılı çekme | Token geçerli | Kullanıcı verisi döner                 |
| Yetkisiz       | API 401 döner | `'Yetkisiz erişim'` hatası             |
| Data gelmez    | Boş yanıt     | `'Kullanıcı bilgisi alınamadı'` hatası |

#### `logout` Testi

| Test      | Senaryo             | Beklenen Sonuç                            |
| --------- | ------------------- | ----------------------------------------- |
| Çıkış yap | `logout()` çağrılır | `setAuthToken(null)` ile token temizlenir |

**Toplam: 18 test**

---

### 4. ProductService

**Dosya:** `__tests__/services/productService.test.ts`  
**Kategori:** Birim Testi — Servis Katmanı  
**Mock'lananlar:** `apiClient`

Ürün servisinin tüm metodlarını izole biçimde test eder.

| Test          | Metod                             | Senaryo              | Beklenen Sonuç                 |
| ------------- | --------------------------------- | -------------------- | ------------------------------ |
| Ürün listesi  | `getProducts()`                   | Normal istek         | 2 ürün döner                   |
| Boş liste     | `getProducts()`                   | Data null gelir      | Boş dizi döner                 |
| ID ile ürün   | `getProductById(1)`               | Geçerli ID           | Ürün nesnesi döner             |
| Bulunamadı    | `getProductById(999)`             | Data null, mesaj var | `'Bulunamadı'` hatası          |
| Mesajsız hata | `getProductById(999)`             | Data null, mesaj yok | `'Ürün bulunamadı'` fallback   |
| Slug ile ürün | `getProductBySlug('slug')`        | Geçerli slug         | Ürün nesnesi döner             |
| Geçersiz slug | `getProductBySlug('gecersiz')`    | Data null            | `'Ürün bulunamadı'` hatası     |
| Arama         | `searchProducts({search:'test'})` | Sonuç var            | 1 ürün döner                   |
| Boş arama     | `searchProducts({search:'x'})`    | Data null            | Boş dizi döner                 |
| Sayfalama     | `getPaginatedProducts({page:1})`  | Geçerli istek        | Sayfalama meta verisiyle döner |

**Toplam: 10 test**

---

### 5. AuthContext

**Dosya:** `__tests__/context/AuthContext.test.tsx`  
**Kategori:** Entegrasyon Testi — React Context  
**Mock'lananlar:** `authService` (tüm metodlar)

`AuthProvider` ve `useAuth` hook'unun davranışlarını gerçek React render ortamında test eder.

| Test                  | Senaryo                               | Beklenen Sonuç                                           |
| --------------------- | ------------------------------------- | -------------------------------------------------------- |
| Yükleme durumu        | Token var, istek bekliyor             | `isLoading: true` iken yükleme ekranı görünür            |
| Token yok             | localStorage boş                      | Kullanıcı giriş yapmamış görünür                         |
| Geçerli token         | Token ile kullanıcı çekilir           | Kullanıcı adı ve `isAuthenticated: true` görünür         |
| Çıkış yapma           | `logout()` butona tıklanır            | `isAuthenticated: false`, token localStorage'dan silinir |
| Context dışı kullanım | `useAuth()` provider dışında çağrılır | `'useAuth must be used within an AuthProvider'` hatası   |
| localStorage hatası   | `setItem` throws                      | `console.error('Token storage error')` çağrılır          |
| Kayıt işlemi          | `register()` başarılı                 | Kullanıcı state'e set edilir                             |
| Email doğrulama       | `verifyEmail()` başarılı              | Kullanıcı state'e set edilir                             |

**Toplam: 8 test**

---

### 6. CartContext

**Dosya:** `__tests__/context/CartContext.test.tsx`  
**Kategori:** Entegrasyon Testi — React Context  
**Mock'lananlar:** `apiClient` (GET, POST, PUT, DELETE)

`CartProvider` ve `useCart` hook'unun misafir (guest) ve hatalı durumlardaki davranışlarını test eder.

#### Misafir Modu (localStorage) Testleri

| Test              | Senaryo                         | Beklenen Sonuç                       |
| ----------------- | ------------------------------- | ------------------------------------ |
| Boş sepet         | Başlangıç durumu                | `totalItems: 0`                      |
| Ürün ekleme       | `addToCart()` guest olarak      | `guestCart` localStorage'a yazılır   |
| Ürün silme        | `removeFromCart()` guest olarak | `guestCart` güncellenir              |
| Miktar güncelleme | `updateQuantity()`              | `guestCart`'ta quantity artar        |
| Sepeti boşaltma   | `clearCart()`                   | `guestCart` localStorage'dan silinir |

#### Hata Yönetimi Testleri

| Test                  | Senaryo              | Beklenen Sonuç                                    |
| --------------------- | -------------------- | ------------------------------------------------- |
| fetchCart hatası      | API GET başarısız    | `console.error('Failed to fetch cart:')` çağrılır |
| addToCart hatası      | API POST başarısız   | `console.error('Cart add failed:')` çağrılır      |
| removeFromCart hatası | API DELETE başarısız | `console.error('Cart remove failed:')` çağrılır   |
| updateQuantity hatası | API PUT başarısız    | `console.error('Cart update failed:')` çağrılır   |
| clearCart hatası      | API DELETE başarısız | `console.error('Cart clear failed:')` çağrılır    |
| variantId yok         | Geçersiz ürün ekleme | `console.error('variantId yok')` çağrılır         |

#### Sepet UI Testleri

| Test                  | Senaryo                      | Beklenen Sonuç                                        |
| --------------------- | ---------------------------- | ----------------------------------------------------- |
| Sepet açma/kapama     | `openCart()` / `closeCart()` | `isOpen` state değişir                                |
| Context dışı kullanım | `useCart()` provider dışında | `'useCart must be used within a CartProvider'` hatası |
| Miktar 0 güncelleme   | `updateQuantity(id, 0)`      | `removeFromCart` otomatik çağrılır                    |

**Toplam: 13 test**

---

### 7. Navbar Bileşeni

**Dosya:** `__tests__/components/Navbar.test.tsx`  
**Kategori:** Bileşen Testi  
**Mock'lananlar:** `AuthContext`, `CartContext` (Provider mock değerleriyle sarmalanır)

Navbar bileşeninin kimlik doğrulama durumu ve etkileşim senaryolarındaki davranışlarını test eder.

| Test                 | Senaryo                                | Beklenen Sonuç                         |
| -------------------- | -------------------------------------- | -------------------------------------- |
| Giriş yapılmadığında | `isAuthenticated: false`               | Hover ile `'Üye Girişi'` linki görünür |
| Giriş yapıldığında   | `user: {firstName: 'Davut'}`           | `'Davut'` adı navbar'da görünür        |
| Arama kutusu         | Input'a yazı yazıp Enter               | Arama tetiklenir                       |
| Mobil menü           | Toggle butonuna tıklandığında          | `'TÜM ÜRÜNLER'` linki görünür          |
| Arama hover          | MouseEnter/MouseLeave                  | Olaylar hatasız tetiklenir             |
| Mobil arama          | Menü açıkken mobil input               | Yazı yazılabilir                       |
| Çıkış yap            | Giriş yapılmış kullanıcı logout tıklar | `logout()` fonksiyonu çağrılır         |
| Sepet ikonu          | Sepet butonuna tıklanır                | `openCart()` fonksiyonu çağrılır       |

**Toplam: 8 test**

---

### 8. ReviewModal Bileşeni

**Dosya:** `__tests__/components/ReviewModal.test.tsx`  
**Kategori:** Bileşen Testi  
**Mock'lananlar:** `apiClient` (POST, PATCH), `AuthContext`

Ürün yorumu ekleme ve düzenleme modalının tüm akışlarını test eder.

| Test                      | Senaryo                           | Beklenen Sonuç                                      |
| ------------------------- | --------------------------------- | --------------------------------------------------- |
| Ürün adı görüntüleme      | Modal açıldığında                 | `'Test Ürünü'` başlığı görünür                      |
| Yıldız puanlama           | `getAllByRole('button')`          | 5 adet yıldız butonu bulunur                        |
| Form alanları             | Placeholder kontrolü              | Başlık ve yorum alanları mevcut                     |
| Başarılı gönderim         | 3 yıldız + dolu form + Gönder     | `POST /comments` çağrılır, `onSuccess` tetiklenir   |
| API hatası                | `mockPost.mockRejectedValue(...)` | `'Daha önce yorum yapmışsınız'` hata mesajı görünür |
| Boş yorum                 | Yıldız seçili, yorum boş          | `'Lütfen yorum yazınız'` hatası, POST çağrılmaz     |
| Düzenleme modu yükleme    | `editMode=true` + mevcut yorum    | Eski başlık/yorum form alanlarına yüklenir          |
| Düzenleme modu güncelleme | Yeni başlık yazıp Güncelle        | `PATCH /comments/123` çağrılır                      |

**Toplam: 8 test**

---

## ⚙️ Backend Testleri

Backend testleri `back-end/__test__/` dizininde bulunmaktadır.

---

### 1. Auth / User Service

**Dosya:** `__test__/auth.test.ts`  
**Kategori:** Birim Testi — Servis Katmanı  
**Mock'lananlar:** Prisma, bcrypt, jsonwebtoken, mail servisi

Kullanıcı kayıt, giriş, şifre sıfırlama akışlarını veritabanı bağlantısı olmadan test eder.

#### `createUser` Testleri

| Test                                 | Senaryo        | Beklenen Sonuç                                             |
| ------------------------------------ | -------------- | ---------------------------------------------------------- |
| Email çakışması (ConflictError türü) | Email kayıtlı  | `ConflictError` fırlatır                                   |
| Email çakışması (mesaj)              | Email kayıtlı  | `'Bu email zaten kullanılıyor'` mesajı                     |
| Şifre hashleme                       | Yeni kullanıcı | `bcrypt.hash('raw_pass', 10)` çağrılır, hash DB'ye yazılır |
| Kullanıcı döner                      | Başarılı kayıt | Oluşturulan kullanıcı nesnesi döner                        |
| Hoşgeldin e-postası                  | Kayıt sonrası  | `sendWelcomeEmail` fire-and-forget ile çağrılır            |

#### `loginUser` Testleri

| Test                         | Senaryo              | Beklenen Sonuç                                          |
| ---------------------------- | -------------------- | ------------------------------------------------------- |
| Kullanıcı bulunamadı         | Email yok            | `UnauthorizedError` fırlatır                            |
| Kullanıcı bulunamadı (mesaj) | Email yok            | `'Email veya şifre hatalı'` mesajı                      |
| Yanlış şifre                 | bcrypt compare false | `UnauthorizedError` fırlatır                            |
| Başarılı giriş               | Geçerli kimlik       | JWT token ve `hashedPassword` olmayan kullanıcı döner   |
| JWT payload                  | Başarılı giriş       | `{userId, email, role}` payload ile imzalı JWT üretilir |
| DB sorgusu                   | Email doğrulaması    | `findUnique({ where: { email } })` çağrılır             |

#### `requestPasswordReset` Testleri

| Test                 | Senaryo       | Beklenen Sonuç                                            |
| -------------------- | ------------- | --------------------------------------------------------- |
| Email bulunamadı     | Kullanıcı yok | Sessizce döner (enumeration koruması)                     |
| Reset token üretilir | Kullanıcı var | 64 karakterlik hex token + 1 saatlik expiry DB'ye yazılır |
| E-posta gönderilir   | Kullanıcı var | `sendPasswordResetEmail` token ile çağrılır               |

#### `resetPassword` Testleri

| Test                       | Senaryo           | Beklenen Sonuç                                                                        |
| -------------------------- | ----------------- | ------------------------------------------------------------------------------------- |
| Geçersiz token (hata türü) | Token bulunamaz   | `UnauthorizedError` fırlatır                                                          |
| Geçersiz token (mesaj)     | Token bulunamaz   | `'Geçersiz veya süresi dolmuş token'`                                                 |
| Yeni şifre hashlenir       | Geçerli token     | `bcrypt.hash` çağrılır, token ve expiry null'a set edilir                             |
| Başarı mesajı              | İşlem tamamlanır  | `{message: 'Şifreniz başarıyla güncellendi'}` döner                                   |
| DB sorgusu                 | Token doğrulaması | `findFirst({ where: { resetToken, resetTokenExpiry: { gt: new Date() } } })` çağrılır |

**Toplam: 18 test**

---

### 2. Cart Service

**Dosya:** `__test__/cart.test.ts`  
**Kategori:** Birim Testi — Servis Katmanı  
**Mock'lananlar:** Prisma (cart, cartItem, productVariant tabloları)

Sepet yönetimi iş mantığını tüm hata ve başarı senaryolarıyla test eder.

#### `getOrCreateCart` Testleri

| Test         | Senaryo   | Beklenen Sonuç                  |
| ------------ | --------- | ------------------------------- |
| Mevcut sepet | Sepet var | Sepet bulunur, create çağrılmaz |
| Yeni sepet   | Sepet yok | Yeni sepet oluşturulur ve döner |

#### `addToCart` Testleri

| Test                    | Senaryo                   | Beklenen Sonuç                                   |
| ----------------------- | ------------------------- | ------------------------------------------------ |
| Varyant yok             | `productVariant` null     | `NotFoundError: 'Ürün varyantı bulunamadı'`      |
| Varyant pasif           | `isActive: false`         | `BadRequestError: 'Bu ürün şu an satışta değil'` |
| Ürün pasif              | `product.isActive: false` | `BadRequestError` fırlatır                       |
| Stok yetersiz           | `stockCount: 0`           | `BadRequestError: 'Yetersiz stok'`               |
| Zaten sepette           | CartItem mevcut           | Miktar güncellenir (2+3=5)                       |
| Stok aşımı (güncelleme) | Mevcut+yeni > stok        | `BadRequestError: 'Yetersiz stok'`               |
| Yeni ekleme             | CartItem yok              | Yeni cartItem oluşturulur                        |

#### `updateCartItemQuantity` Testleri

| Test                | Senaryo                         | Beklenen Sonuç                               |
| ------------------- | ------------------------------- | -------------------------------------------- |
| Item yok            | CartItem null                   | `NotFoundError` fırlatır                     |
| Başka kullanıcı     | `cart.userId !== requestUserId` | `BadRequestError: 'Bu sepet size ait değil'` |
| Stok aşımı          | `quantity > stockCount`         | `BadRequestError` fırlatır                   |
| Başarılı güncelleme | Tüm doğrulamalar geçer          | `cartItem.update({quantity: 5})` çağrılır    |

#### `removeFromCart` Testleri

| Test            | Senaryo                | Beklenen Sonuç                                |
| --------------- | ---------------------- | --------------------------------------------- |
| Item yok        | CartItem null          | `NotFoundError` fırlatır                      |
| Başka kullanıcı | `cart.userId` eşleşmez | `BadRequestError` fırlatır                    |
| Başarılı silme  | Sahiplik doğrulandı    | `cartItem.delete({ where: { id } })` çağrılır |

#### `clearCart` Testleri

| Test                | Senaryo   | Beklenen Sonuç                                        |
| ------------------- | --------- | ----------------------------------------------------- |
| Sepeti boşalt       | Sepet var | `cartItem.deleteMany({ where: { cartId } })` çağrılır |
| Sepet yokken boşalt | Sepet yok | Önce oluşturulur, sonra boşaltılır                    |

**Toplam: 15 test**

---

## 📊 Test Özeti

### Frontend (Vitest)

| Test Dosyası                      | Test Sayısı | Kapsam               |
| --------------------------------- | ----------- | -------------------- |
| `sanity.test.ts`                  | 1           | Test ortamı          |
| `api/endpoints.test.ts`           | 9           | URL üreticileri      |
| `services/authService.test.ts`    | 18          | Auth servis katmanı  |
| `services/productService.test.ts` | 10          | Ürün servis katmanı  |
| `context/AuthContext.test.tsx`    | 8           | Auth context & hook  |
| `context/CartContext.test.tsx`    | 13          | Cart context & hook  |
| `components/Navbar.test.tsx`      | 8           | Navbar bileşeni      |
| `components/ReviewModal.test.tsx` | 8           | ReviewModal bileşeni |
| **Toplam**                        | **75**      |                      |

### Backend (Jest)

| Test Dosyası            | Test Sayısı | Kapsam                   |
| ----------------------- | ----------- | ------------------------ |
| `__test__/auth.test.ts` | 18          | Kullanıcı / Auth servisi |
| `__test__/cart.test.ts` | 15          | Sepet servisi            |
| **Toplam**              | **33**      |                          |

### Genel Toplam

|                       | Sayı    |
| --------------------- | ------- |
| Toplam test dosyası   | 10      |
| Toplam test senaryosu | **108** |

---

## � Test Coverage (Kapsam)

### Frontend (Vitest)

| Kriter                   | Kapsam Oranı |
| ------------------------ | ------------ |
| Statements (İfadeler)    | %96.67       |
| Branches (Dallar)        | %89.22       |
| Functions (Fonksiyonlar) | %95.89       |
| Lines (Satırlar)         | %97.59       |

### Backend (Jest)

| Kriter                   | Kapsam Oranı |
| ------------------------ | ------------ |
| Statements (İfadeler)    | %97.29       |
| Branches (Dallar)        | %79.16       |
| Functions (Fonksiyonlar) | %87.50       |
| Lines (Satırlar)         | %98.01       |

---

## �🚀 Test Komutları

### Frontend Testlerini Çalıştırma

```bash
cd frontend
npm run test          # Tüm testleri çalıştır
npm run test:coverage # Kapsamlı test raporu
npm run test:ui       # Vitest UI arayüzü
```

### Backend Testlerini Çalıştırma

```bash
cd back-end
npm run test          # Tüm testleri çalıştır
npm run test:watch    # İzleme modunda çalıştır
```
