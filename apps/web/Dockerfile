# ─────────────────────────────────────────────────────────────
# OnlyJS Academy — Web (Front-End) Dockerfile
# Kullanım:
#   docker build -t onlyjs-web .
#   docker run -p 80:80 onlyjs-web
# ─────────────────────────────────────────────────────────────

# 1) Derleme aşaması
FROM node:20-alpine AS builder
RUN apk add --no-cache unzip
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Production: /api = relative URL, nginx proxy ile API'ye yönlendirilir (CORS yok)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# npm run build: prebuild (copy:images) + tsc + vite build
ENV NODE_OPTIONS=--max-old-space-size=2048
RUN npm run build

# 2) NGINX ile statik dosya sunumu
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html

# SPA + API proxy: /api ve /uploads backend'e yönlendirilir (aynı origin = CORS yok)
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location /api/ { \
        proxy_pass http://api:3000; \
        proxy_http_version 1.1; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
    location /uploads/ { \
        proxy_pass http://api:3000; \
        proxy_http_version 1.1; \
        proxy_set_header Host $host; \
    } \
    location / { try_files $uri $uri/ /index.html; } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
