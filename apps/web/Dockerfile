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

# Production'da API URL (örn. http://13.61.27.22:3000/api)
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL

# npm run build: prebuild (copy:images) + tsc + vite build
ENV NODE_OPTIONS=--max-old-space-size=2048
RUN npm run build

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
