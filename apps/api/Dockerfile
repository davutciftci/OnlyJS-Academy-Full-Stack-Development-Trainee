# ─────────────────────────────────────────────────────────────
# OnlyJS Academy — API (Back-End) Dockerfile
# Kullanım:
#   docker build -t onlyjs-api .
#   docker run -p 3000:3000 --env-file .env onlyjs-api
# ─────────────────────────────────────────────────────────────

# 1) Bağımlılıkları yükle
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2) Derleme aşaması
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) Üretim imajı (sadece dist + üretim bağımlılıkları)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/index.js"]
