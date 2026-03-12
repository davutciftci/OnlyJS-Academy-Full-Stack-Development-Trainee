# ─────────────────────────────────────────────────────────────
# OnlyJS Academy — API (Back-End) Dockerfile
# Kullanım:
#   docker build -t onlyjs-api .
#   docker run -p 3000:3000 --env-file .env onlyjs-api
# ─────────────────────────────────────────────────────────────

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2) Derleme aşaması
FROM node:20-alpine AS builder
WORKDIR /app
# openssl: Prisma native engine için gerekli (libssl.so.1.1 uyumluluğu)
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Prisma client'ı generate et
RUN npx prisma generate
RUN npm run build

# 3) Üretim imajı
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# openssl: Prisma query engine'in libssl.so.1.1 bağımlılığı için gerekli
RUN apk add --no-cache openssl

COPY package*.json ./
# Tüm bağımlılıkları kur (prisma ve @prisma/client artık dependencies'te)
RUN npm ci --only=production

# Builder'dan hem dist hem generated prisma client'ı al
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Entrypoint script: migrate deploy + sunucu başlatma
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000
CMD ["sh", "entrypoint.sh"]
