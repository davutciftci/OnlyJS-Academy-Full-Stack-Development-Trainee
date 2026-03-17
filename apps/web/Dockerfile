# ─────────────────────────────────────────────────────────────
# OnlyJS Academy — Web (Front-End) Dockerfile
# Kullanım:
#   docker build -t onlyjs-web .
#   docker run -p 80:80 onlyjs-web
# ─────────────────────────────────────────────────────────────

# 1) Derleme aşaması
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# tsc ve vite ayrı process'te: düşük RAM'de heap birikmesini önler
RUN npx tsc -b
ENV NODE_OPTIONS=--max-old-space-size=2048
RUN npx vite build

# 2) NGINX ile statik dosya sunumu
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html

# Opsiyonel: React Router için SPA yönlendirmesi
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { try_files $uri $uri/ /index.html; } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
