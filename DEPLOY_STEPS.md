# Deploy Adımları

## Otomatik Deploy (GitHub Actions)

`main` branch'e push yapıldığında otomatik çalışır:

1. Testler çalışır
2. API ve Web Docker image'ları build edilip Docker Hub'a push edilir
3. EC2 sunucusuna SSH ile bağlanılır:
   - `git pull origin main` – güncel kod (docker-compose dahil)
   - `docker compose pull` – yeni image'lar çekilir
   - `docker compose up -d` – container'lar yeniden başlar

## Sunucuda Manuel Deploy

Sunucuya SSH ile bağlandıktan sonra:

```bash
cd ~/onlyjs-academy   # veya REPO_DIR ile belirtilen dizin
./scripts/deploy.sh main
```

Bu script:
- `git pull` ile kodu günceller
- `docker compose build` ve `up` ile uygulamayı yeniden başlatır

## Görsel Yapısı

| Konum | İçerik |
|-------|--------|
| `apps/web/image/` | Statik site görselleri (logo, hero, footer-banner, kategori kartları) |
| `apps/api/uploads/` | Admin panelden yüklenen ürün fotoğrafları (Docker volume ile kalıcı) |

## Docker Volume

- `api_uploads`: Ürün fotoğrafları container yeniden başlasa bile korunur.
- `postgres_data`: Veritabanı verileri kalıcıdır.

## Gereksinimler

- EC2'de proje `~/onlyjs-academy` dizininde klonlu olmalı
- GitHub Secrets: `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `EC2_SSH_KEY`, `EC2_USER`, `EC2_HOST`
- Sunucuda `docker` ve `docker compose` kurulu olmalı
