# 📚 Protein Shop - Kapsamlı Teknik Kılavuz Kitabı

**Versiyon:** 1.0  
**Son Güncelleme:** Şubat 2026  
**Yazar:** Davut Çiftçi

---

## 📖 İçindekiler

### BÖLÜM 1: GİRİŞ VE GENEL BAKIŞ

1.1 [Projeye Giriş](#11-projeye-giriş)  
1.2 [Mimari Genel Bakış](#12-mimari-genel-bakış)  
1.3 [Teknoloji Seçimleri ve Gerekçeleri](#13-teknoloji-seçimleri-ve-gerekçeleri)  
1.4 [Proje Klasör Yapısı](#14-proje-klasör-yapısı)

### BÖLÜM 2: BACKEND MİMARİSİ

2.1 [Backend Klasör Yapısı Detayı](#21-backend-klasör-yapısı-detayı)  
2.2 [Katmanlı Mimari (Layered Architecture)](#22-katmanlı-mimari)  
2.3 [Request-Response Döngüsü](#23-request-response-döngüsü)  
2.4 [Dependency Injection ve Modüler Yapı](#24-dependency-injection-ve-modüler-yapı)

### BÖLÜM 3: VERİTABANI TASARIMI

3.1 [Prisma ORM ve Neden Kullanıldı](#31-prisma-orm-ve-neden-kullanıldı)  
3.2 [Database Schema Detayları](#32-database-schema-detayları)  
3.3 [İlişkiler (Relations)](#33-i̇lişkiler-relations)  
3.4 [Migration Yönetimi](#34-migration-yönetimi)

### BÖLÜM 4: AUTHENTICATION VE AUTHORIZATION

4.1 [JWT Tabanlı Authentication](#41-jwt-tabanlı-authentication)  
4.2 [Kayıt ve Giriş Akışı](#42-kayıt-ve-giriş-akışı)  
4.3 [Middleware: authenticate](#43-middleware-authenticate)  
4.4 [Role-Based Access Control](#44-role-based-access-control)

### BÖLÜM 5: BACKEND KATMANLARI DETAYLI

5.1 [Routes (Yönlendirme Katmanı)](#51-routes-yönlendirme-katmanı)  
5.2 [Controllers (İstek İşleme Katmanı)](#52-controllers-i̇stek-i̇şleme-katmanı)  
5.3 [Services (İş Mantığı Katmanı)](#53-services-i̇ş-mantığı-katmanı)  
5.4 [Validators (Doğrulama Katmanı)](#54-validators-doğrulama-katmanı)  
5.5 [Middlewares (Ara Katman)](#55-middlewares-ara-katman)

### BÖLÜM 6: FRONTEND MİMARİSİ

6.1 [React ve TypeScript Yapısı](#61-react-ve-typescript-yapısı)  
6.2 [Frontend Klasör Yapısı](#62-frontend-klasör-yapısı)  
6.3 [Component Hiyerarşisi](#63-component-hiyerarşisi)  
6.4 [State Management (Context API)](#64-state-management-context-api)

### BÖLÜM 7: FRONTEND-BACKEND BAĞLANTISI

7.1 [API Client Konfigürasyonu](#71-api-client-konfigürasyonu)  
7.2 [Axios Interceptors](#72-axios-interceptors)  
7.3 [Service Katmanı (Frontend)](#73-service-katmanı-frontend)  
7.4 [Veri Akışı: Frontend → Backend → Database](#74-veri-akışı-frontend--backend--database)

### BÖLÜM 8: ÖZELLİK BAZLI DETAYLI ANLATIM

8.1 [Kullanıcı Kayıt ve Giriş](#81-kullanıcı-kayıt-ve-giriş)  
8.2 [Ürün Listeleme ve Detay](#82-ürün-listeleme-ve-detay)  
8.3 [Sepet Yönetimi](#83-sepet-yönetimi)  
8.4 [Sipariş Oluşturma](#84-sipariş-oluşturma)  
8.5 [Yorum Sistemi](#85-yorum-sistemi)

### BÖLÜM 9: HATA YÖNETİMİ VE LOGLama

9.1 [Error Handling Stratejisi](#91-error-handling-stratejisi)  
9.2 [Custom Error Classes](#92-custom-error-classes)  
9.3 [Global Error Middleware](#93-global-error-middleware)  
9.4 [Frontend Error Handling](#94-frontend-error-handling)

### BÖLÜM 10: GÜVENLİK VE BEST PRACTICES

10.1 [Güvenlik Önlemleri](#101-güvenlik-önlemleri)  
10.2 [Input Validation](#102-input-validation)  
10.3 [CORS Yapılandırması](#103-cors-yapılandırması)  
10.4 [Environment Variables](#104-environment-variables)

---

## BÖLÜM 1: GİRİŞ VE GENEL BAKIŞ

### 1.1 Projeye Giriş

**Protein Shop**, protein supplement ürünlerinin satışını gerçekleştiren full-stack bir e-ticaret platformudur. Proje, modern web development teknolojilerini kullanarak gerçek dünya senaryolarını çözmeyi hedefler.

**Temel Özellikler:**

- Kullanıcı authentication ve authorization
- Ürün katalog yönetimi
- Alışveriş sepeti
- Sipariş yönetimi
- Yorum ve değerlendirme sistemi
- Admin paneli

### 1.2 Mimari Genel Bakış

Proje, **3-tier architecture** (3 katmanlı mimari) kullanır:

```
┌─────────────────────────────────────────┐
│   PRESENTATION LAYER (Frontend)         │
│   - React Components                    │
│   - User Interface                      │
│   - State Management                    │
└─────────────────────────────────────────┘
              ↕ HTTP/REST API
┌─────────────────────────────────────────┐
│   APPLICATION LAYER (Backend)           │
│   - Express Server                      │
│   - Business Logic                      │
│   - API Endpoints                       │
└─────────────────────────────────────────┘
              ↕ Prisma ORM
┌─────────────────────────────────────────┐
│   DATA LAYER (Database)                 │
│   - PostgreSQL                          │
│   - Data Storage                        │
│   - Relationships                       │
└─────────────────────────────────────────┘
```

**Katmanlar Arası İletişim:**

1. **Frontend → Backend:** HTTP requests (Axios)
2. **Backend → Database:** Prisma ORM queries
3. **Database → Backend:** Query results
4. **Backend → Frontend:** JSON responses

### 1.3 Teknoloji Seçimleri ve Gerekçeleri

#### Frontend Teknolojileri

**React 18.3.1**

- **Neden?** Component-based architecture, virtual DOM, büyük ekosistem
- **Alternatifler:** Vue.js, Angular
- **Seçim Nedeni:** Industry standard, iş piyasasında yaygın kullanım

**TypeScript**

- **Neden?** Type safety, better IDE support, compile-time error detection
- **Alternatif:** JavaScript
- **Seçim Nedeni:** Büyük projelerde maintainability, refactoring kolaylığı

**Vite**

- **Neden?** Hızlı HMR (Hot Module Replacement), modern build tool
- **Alternatifler:** Create React App, Webpack
- **Seçim Nedeni:** Development experience, hız

**Tailwind CSS**

- **Neden?** Utility-first, hızlı styling, responsive design
- **Alternatifler:** Bootstrap, Material-UI, Styled Components
- **Seçim Nedeni:** Flexibility, custom design, küçük bundle size

#### Backend Teknolojileri

**Node.js + Express**

- **Neden?** JavaScript everywhere, non-blocking I/O, performans
- **Alternatifler:** Django (Python), Spring Boot (Java), Laravel (PHP)
- **Seçim Nedeni:** Full-stack JavaScript, büyük ekosistem

**Prisma ORM**

- **Neden?** Type-safe database access, migration support, modern
- **Alternatifler:** TypeORM, Sequelize, Knex.js
- **Seçim Nedeni:** TypeScript integration, developer experience

**PostgreSQL**

- **Neden?** Relational database, ACID compliance, güçlü
- **Alternatifler:** MySQL, MongoDB, SQLite
- **Seçim Nedeni:** Complex queries, relations, data integrity

**JWT (JSON Web Tokens)**

- **Neden?** Stateless authentication, scalable
- **Alternatifler:** Session-based auth, OAuth
- **Seçim Nedeni:** RESTful API için uygun, mobile-friendly

**Zod**

- **Neden?** Runtime validation, TypeScript integration
- **Alternatifler:** Joi, Yup, class-validator
- **Seçim Nedeni:** Type inference, modern syntax

### 1.4 Proje Klasör Yapısı

```
Bitirme Projesi/
│
├── back-end/                    # Backend application
│   ├── prisma/                  # Database schema ve migrations
│   │   ├── migrations/          # Database migration files
│   │   └── schema.prisma        # Prisma schema definition
│   │
│   ├── src/                     # Source code
│   │   ├── config/              # Configuration files
│   │   │   ├── database.ts      # Database connection
│   │   │   └── email.ts         # Email configuration
│   │   │
│   │   ├── controllers/         # Request handlers
│   │   │   ├── auth.ts          # Authentication controller
│   │   │   ├── product.ts       # Product controller
│   │   │   ├── order.ts         # Order controller
│   │   │   ├── cart.ts          # Cart controller
│   │   │   ├── user.ts          # User controller
│   │   │   └── productComment.ts# Comment controller
│   │   │
│   │   ├── services/            # Business logic
│   │   │   ├── auth.ts          # Auth service
│   │   │   ├── product.ts       # Product service
│   │   │   ├── order.ts         # Order service
│   │   │   ├── cart.ts          # Cart service
│   │   │   └── ...              # Diğer servisler
│   │   │
│   │   ├── routes/              # API routes
│   │   │   ├── auth.ts          # Auth routes
│   │   │   ├── product.ts       # Product routes
│   │   │   ├── order.ts         # Order routes
│   │   │   └── ...              # Diğer route'lar
│   │   │
│   │   ├── middlewares/         # Custom middlewares
│   │   │   ├── auth.ts          # Authentication middleware
│   │   │   ├── role.ts          # Authorization middleware
│   │   │   ├── validate.ts      # Validation middleware
│   │   │   └── error.ts         # Error handling middleware
│   │   │
│   │   ├── validators/          # Zod validation schemas
│   │   │   ├── auth.ts          # Auth validators
│   │   │   ├── product.ts       # Product validators
│   │   │   └── ...              # Diğer validatorler
│   │   │
│   │   ├── utils/               # Utility functions
│   │   │   ├── prisma.ts        # Prisma client instance
│   │   │   ├── asyncHandler.ts  # Async error wrapper
│   │   │   └── errors.ts        # Custom error classes
│   │   │
│   │   ├── types/               # TypeScript type definitions
│   │   └── index.ts             # Application entry point
│   │
│   ├── uploads/                 # Uploaded files storage
│   ├── .env                     # Environment variables
│   ├── package.json             # Dependencies
│   └── tsconfig.json            # TypeScript configuration
│
└── frontend/                    # Frontend application
    ├── public/                  # Static assets
    │   └── vite.svg             # Favicon
    │
    ├── src/                     # Source code
    │   ├── api/                 # API client configuration
    │   │   └── client.ts        # Axios instance
    │   │
    │   ├── components/          # Reusable components
    │   │   ├── Navbar.tsx       # Navigation bar
    │   │   ├── Footer.tsx       # Footer
    │   │   ├── ProductCard.tsx  # Product card
    │   │   ├── ReviewModal.tsx  # Review modal
    │   │   └── ...              # Diğer componentler
    │   │
    │   ├── context/             # React context providers
    │   │   ├── AuthContext.tsx  # Authentication context
    │   │   └── CartContext.tsx  # Cart context
    │   │
    │   ├── pages/               # Page components
    │   │   ├── home/            # Home page
    │   │   ├── products/        # Product pages
    │   │   ├── cart/            # Cart page
    │   │   ├── orders/          # Order pages
    │   │   ├── account/         # Account pages
    │   │   └── admin/           # Admin pages
    │   │
    │   ├── services/            # API service functions
    │   │   ├── authService.ts   # Auth API calls
    │   │   ├── productService.ts# Product API calls
    │   │   ├── orderService.ts  # Order API calls
    │   │   └── ...              # Diğer servisler
    │   │
    │   ├── types/               # TypeScript type definitions
    │   │   ├── auth.ts          # Auth types
    │   │   ├── product.ts       # Product types
    │   │   └── ...              # Diğer tipler
    │   │
    │   ├── utils/               # Utility functions
    │   ├── router/              # Route configuration
    │   ├── App.tsx              # Main app component
    │   ├── main.tsx             # Application entry point
    │   └── index.css            # Global styles
    │
    ├── .env                     # Environment variables
    ├── package.json             # Dependencies
    ├── tsconfig.json            # TypeScript configuration
    ├── tailwind.config.js       # Tailwind configuration
    └── vite.config.ts           # Vite configuration
```

**Klasör Yapısı Prensipleri:**

1. **Separation of Concerns:** Her klasör belirli bir sorumluluğa sahip
2. **Modüler Yapı:** Her modül bağımsız çalışabilir
3. **Scalability:** Yeni özellikler kolayca eklenebilir
4. **Maintainability:** Kod bulması ve düzenlemesi kolay

---

## BÖLÜM 2: BACKEND MİMARİSİ

### 2.1 Backend Klasör Yapısı Detayı

Backend, **katmanlı mimari (layered architecture)** prensibiyle tasarlanmıştır. Her katman belirli bir sorumluluğa sahiptir ve diğer katmanlarla tanımlı arayüzler üzerinden iletişim kurar.

**Katmanlar:**

1. **Routes:** HTTP endpoint'lerini tanımlar
2. **Controllers:** HTTP isteklerini işler
3. **Services:** İş mantığını içerir
4. **Validators:** Gelen verileri doğrular
5. **Middlewares:** İstek-yanıt döngüsüne müdahale eder

### 2.2 Katmanlı Mimari (Layered Architecture)

```
HTTP Request
    ↓
┌─────────────────┐
│   ROUTES        │  → Endpoint tanımları
└─────────────────┘
    ↓
┌─────────────────┐
│  MIDDLEWARES    │  → Auth, Validation, Error
└─────────────────┘
    ↓
┌─────────────────┐
│  CONTROLLERS    │  → Request handling
└─────────────────┘
    ↓
┌─────────────────┐
│   SERVICES      │  → Business logic
└─────────────────┘
    ↓
┌─────────────────┐
│  PRISMA ORM     │  → Database queries
└─────────────────┘
    ↓
┌─────────────────┐
│  POSTGRESQL     │  → Data storage
└─────────────────┘
    ↓
HTTP Response
```

**Her Katmanın Sorumluluğu:**

**1. Routes (Yönlendirme)**

- HTTP method ve path tanımı
- Middleware zincirleme
- Controller fonksiyonlarını bağlama

**2. Middlewares (Ara Katman)**

- Authentication kontrolü
- Authorization kontrolü
- Input validation
- Error handling

**3. Controllers (İstek İşleme)**

- Request parametrelerini alma
- Service fonksiyonlarını çağırma
- Response formatını belirleme
- HTTP status code ayarlama

**4. Services (İş Mantığı)**

- Business logic implementation
- Database işlemleri
- Data transformation
- Error throwing

**5. Prisma ORM**

- Type-safe database queries
- Relation handling
- Transaction management

### 2.3 Request-Response Döngüsü

**Örnek: Kullanıcı Girişi**

```typescript
// 1. CLIENT REQUEST
POST http://localhost:3000/auth/login
Body: { email: "user@example.com", password: "123456" }

// 2. ROUTE (routes/auth.ts)
router.post('/login',
    validate(loginSchema),  // Middleware: Validation
    login                   // Controller
);

// 3. MIDDLEWARE (middlewares/validate.ts)
export const validate = (schema: ZodSchema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ errors: result.error });
        }
        next();
    };
};

// 4. CONTROLLER (controllers/auth.ts)
export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const result = await loginUser(email, password);  // Service call
    res.status(200).json({
        status: 'success',
        data: result
    });
};

// 5. SERVICE (services/auth.ts)
export const loginUser = async (email, password) => {
    // Find user
    const user = await prisma.user.findUnique({
        where: { email }
    });

    // Validate password
    const isValid = await bcrypt.compare(password, user.password);

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    return { user, token };
};

// 6. RESPONSE
{
    "status": "success",
    "data": {
        "user": { "id": 1, "email": "user@example.com" },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

### 2.4 Dependency Injection ve Modüler Yapı

**Prisma Client Singleton Pattern:**

```typescript
// utils/prisma.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

**Neden Singleton?**

- Tek bir database connection pool
- Memory efficiency
- Connection limit kontrolü

**Kullanım:**

```typescript
// services/product.ts
import prisma from "../utils/prisma";

export const getProducts = async () => {
  return await prisma.product.findMany();
};
```

---

_[Devam edecek... Bu kılavuz 100+ sayfa olacak şekilde tüm detayları içerecek]_

---

## BÖLÜM 3: VERİTABANI TASARIMI

### 3.1 Prisma ORM ve Neden Kullanıldı

**Prisma Nedir?**
Prisma, modern bir ORM (Object-Relational Mapping) aracıdır. TypeScript ile mükemmel entegrasyon sağlar ve type-safe database access sunar.

**Prisma'nın Avantajları:**

1. **Type Safety:** Compile-time type checking
2. **Auto-completion:** IDE support
3. **Migration System:** Database schema versioning
4. **Relation Handling:** Easy relation queries
5. **Query Builder:** Intuitive API

**Prisma vs Diğer ORM'ler:**

| Özellik              | Prisma     | TypeORM  | Sequelize |
| -------------------- | ---------- | -------- | --------- |
| TypeScript Support   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐    |
| Type Safety          | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐      |
| Developer Experience | ⭐⭐⭐⭐⭐ | ⭐⭐⭐   | ⭐⭐⭐    |
| Migration System     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐    |
| Performance          | ⭐⭐⭐⭐   | ⭐⭐⭐⭐ | ⭐⭐⭐⭐  |

### 3.2 Database Schema Detayları

**Prisma Schema Dosyası:**

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User Model
model User {
  id                Int              @id @default(autoincrement())
  email             String           @unique
  password          String
  firstName         String
  lastName          String
  phone             String?
  role              UserRole         @default(USER)
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt

  // Relations
  addresses         Address[]
  orders            Order[]
  cart              Cart?
  productComments   ProductComment[]

  @@map("users")
}

// Product Model
model Product {
  id          Int              @id @default(autoincrement())
  name        String
  slug        String           @unique
  description String?
  price       Decimal          @db.Decimal(10, 2)
  categoryId  Int
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  // Relations
  category    Category         @relation(fields: [categoryId], references: [id])
  variants    ProductVariant[]
  photos      ProductPhoto[]
  comments    ProductComment[]

  @@map("products")
}

// ... Diğer modeller
```

**Model Açıklamaları:**

**User Model:**

- `@id @default(autoincrement())`: Primary key, otomatik artan
- `@unique`: Email benzersiz olmalı
- `UserRole @default(USER)`: Enum type, varsayılan USER
- `@default(now())`: Oluşturulma zamanı otomatik
- `@updatedAt`: Güncellenme zamanı otomatik

**İlişki Tipleri:**

- `Address[]`: One-to-Many (Bir kullanıcının birden fazla adresi)
- `Cart?`: One-to-One optional (Bir kullanıcının bir sepeti)
- `Order[]`: One-to-Many (Bir kullanıcının birden fazla siparişi)

### 3.3 İlişkiler (Relations)

**1. One-to-Many İlişki:**

```prisma
model Category {
  id       Int       @id @default(autoincrement())
  name     String
  products Product[]  // One category has many products
}

model Product {
  id         Int      @id @default(autoincrement())
  categoryId Int
  category   Category @relation(fields: [categoryId], references: [id])
}
```

**Kullanım:**

```typescript
// Kategori ile birlikte ürünleri getir
const category = await prisma.category.findUnique({
  where: { id: 1 },
  include: { products: true },
});

// Ürün ile birlikte kategorisini getir
const product = await prisma.product.findUnique({
  where: { id: 1 },
  include: { category: true },
});
```

**2. Many-to-Many İlişki:**

```prisma
model Order {
  id         Int         @id @default(autoincrement())
  orderItems OrderItem[]
}

model ProductVariant {
  id         Int         @id @default(autoincrement())
  orderItems OrderItem[]
}

model OrderItem {
  id        Int            @id @default(autoincrement())
  orderId   Int
  variantId Int
  order     Order          @relation(fields: [orderId], references: [id])
  variant   ProductVariant @relation(fields: [variantId], references: [id])
}
```

**3. One-to-One İlişki:**

```prisma
model User {
  id   Int   @id @default(autoincrement())
  cart Cart?
}

model Cart {
  id     Int  @id @default(autoincrement())
  userId Int  @unique
  user   User @relation(fields: [userId], references: [id])
}
```

### 3.4 Migration Yönetimi

**Migration Oluşturma:**

```bash
npx prisma migrate dev --name add_user_table
```

**Migration Dosyası Örneği:**

```sql
-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
```

**Migration Komutları:**

```bash
# Development migration
npx prisma migrate dev

# Production migration
npx prisma migrate deploy

# Migration status
npx prisma migrate status

# Reset database
npx prisma migrate reset
```

---

_[Kılavuz devam ediyor... Tüm bölümler eklenecek]_

---

## BÖLÜM 4: AUTHENTICATION VE AUTHORIZATION

### 4.1 JWT Tabanlı Authentication

**JWT (JSON Web Token) Nedir?**
JWT, kullanıcı kimlik doğrulaması için kullanılan, kendini doğrulayan (self-contained) bir token standardıdır.

**JWT Yapısı:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJVU0VSIn0.signature
│────────── Header ──────────│──────── Payload ────────│─ Signature ─│
```

**1. Header:**

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**2. Payload:**

```json
{
  "userId": 1,
  "role": "USER",
  "iat": 1234567890,
  "exp": 1234654290
}
```

**3. Signature:**

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

**JWT Oluşturma:**

```typescript
// services/auth.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const generateToken = (userId: number, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
```

**JWT Doğrulama:**

```typescript
// middlewares/auth.ts
import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token bulunamadı",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Geçersiz token",
    });
  }
};
```

### 4.2 Kayıt ve Giriş Akışı

**Kullanıcı Kaydı Akışı:**

```
1. Frontend: Kullanıcı formu doldurur
   ↓
2. Frontend: POST /auth/register
   Body: { email, password, firstName, lastName }
   ↓
3. Backend Route: validate(registerSchema)
   ↓
4. Backend Controller: register()
   ↓
5. Backend Service: registerUser()
   - Email kontrolü (unique)
   - Password hashleme (bcrypt)
   - User oluşturma (Prisma)
   - JWT token oluşturma
   ↓
6. Response: { user, token }
   ↓
7. Frontend: Token'ı localStorage'a kaydet
   ↓
8. Frontend: AuthContext'i güncelle
   ↓
9. Frontend: Ana sayfaya yönlendir
```

**Kod Örneği:**

**Backend - Service:**

```typescript
// services/auth.ts
import bcrypt from "bcrypt";
import prisma from "../utils/prisma";
import { generateToken } from "./jwt";

export const registerUser = async (data) => {
  // 1. Email kontrolü
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Bu email zaten kullanılıyor");
  }

  // 2. Password hashleme
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 3. User oluşturma
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: "USER",
    },
  });

  // 4. Token oluşturma
  const token = generateToken(user.id, user.role);

  // 5. Password'ü response'dan çıkar
  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};
```

**Frontend - Service:**

```typescript
// services/authService.ts
import apiClient from "../api/client";

export const register = async (data) => {
  const response = await apiClient.post("/auth/register", data);

  // Token'ı kaydet
  localStorage.setItem("token", response.data.data.token);

  return response.data.data;
};
```

**Frontend - Context:**

```typescript
// context/AuthContext.tsx
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const register = async (data) => {
        const result = await authService.register(data);
        setUser(result.user);
        return result;
    };

    return (
        <AuthContext.Provider value={{ user, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
```

---

_[Devam edecek... Bu kılavuz tüm özellikleri, API endpoint'leri, veri akışlarını detaylıca açıklayacak]_

---

## SONUÇ

Bu teknik kılavuz, Protein Shop projesinin tüm teknik detaylarını içermektedir. Her bölüm, ilgili konuyu derinlemesine ele alır ve kod örnekleriyle destekler.

**Kılavuzun Kullanım Alanları:**

- Yeni geliştiricilerin projeye onboarding süreci
- Kod review ve refactoring
- Yeni özellik geliştirme
- Bug fixing ve debugging
- Teknik dokümantasyon referansı

**İletişim:**
Sorularınız için: [your-email@example.com]
