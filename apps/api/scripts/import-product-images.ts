#!/usr/bin/env npx ts-node
/**
 * Kök klasördeki (image/) ürün görsellerini uploads/products/ klasörüne kopyalar
 * ve veritabanına product_photos kayıtları ekler.
 *
 * Kullanım (proje kökünden):
 *   cd apps/api && npx ts-node scripts/import-product-images.ts
 *
 * veya:
 *   npm run import:images --prefix apps/api
 *
 * Mapping: apps/api/scripts/image-mapping.json dosyasında düzenleyebilirsiniz.
 */

import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// Monorepo kökü (apps/api/scripts -> apps/api -> apps -> root)
const PROJECT_ROOT = path.join(__dirname, '..', '..', '..');
const IMAGE_SOURCE_DIR = path.join(PROJECT_ROOT, 'image');
const UPLOAD_DEST_DIR = path.join(__dirname, '..', 'uploads', 'products');
const MAPPING_FILE = path.join(__dirname, 'image-mapping.json');

interface ImageMapping {
  [filename: string]: {
    productId: number;
    isPrimary?: boolean;
    displayOrder?: number;
    altText?: string;
  };
}

// Varsayılan mapping: 1.png->ürün1, 2.png->ürün2, vb. (u1-u6 aynı ürünlere ikinci görsel)
const DEFAULT_MAPPING: ImageMapping = {
  '1.png': { productId: 1, isPrimary: true, displayOrder: 0 },
  '2.png': { productId: 2, isPrimary: true, displayOrder: 0 },
  '3.png': { productId: 3, isPrimary: true, displayOrder: 0 },
  '4.png': { productId: 4, isPrimary: true, displayOrder: 0 },
  '5.png': { productId: 5, isPrimary: true, displayOrder: 0 },
  '6.png': { productId: 6, isPrimary: true, displayOrder: 0 },
  'u1.png': { productId: 1, isPrimary: false, displayOrder: 1 },
  'u2.png': { productId: 2, isPrimary: false, displayOrder: 1 },
  'u3.png': { productId: 3, isPrimary: false, displayOrder: 1 },
  'u4.png': { productId: 4, isPrimary: false, displayOrder: 1 },
  'u5.png': { productId: 5, isPrimary: false, displayOrder: 1 },
  'u6.png': { productId: 6, isPrimary: false, displayOrder: 1 },
};

const PRODUCT_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

async function main() {
  console.log('🖼️  Ürün görselleri import ediliyor...\n');

  if (!fs.existsSync(IMAGE_SOURCE_DIR)) {
    console.error(`❌ Kaynak klasör bulunamadı: ${IMAGE_SOURCE_DIR}`);
    process.exit(1);
  }

  let mapping: ImageMapping;
  if (fs.existsSync(MAPPING_FILE)) {
    mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
    console.log(`📋 Özel mapping kullanılıyor: ${MAPPING_FILE}\n`);
  } else {
    mapping = DEFAULT_MAPPING;
    console.log('📋 Varsayılan mapping kullanılıyor. Özelleştirmek için apps/api/scripts/image-mapping.json oluşturun.\n');
  }

  if (!fs.existsSync(UPLOAD_DEST_DIR)) {
    fs.mkdirSync(UPLOAD_DEST_DIR, { recursive: true });
    console.log(`📁 Klasör oluşturuldu: ${UPLOAD_DEST_DIR}\n`);
  }

  const products = await prisma.product.findMany({ select: { id: true } });
  const productIds = new Set(products.map((p) => p.id));

  let imported = 0;
  let skipped = 0;

  for (const [filename, config] of Object.entries(mapping)) {
    if (!productIds.has(config.productId)) {
      console.log(`⏭️  Atlanıyor ${filename}: Ürün ID ${config.productId} bulunamadı`);
      skipped++;
      continue;
    }

    const srcPath = path.join(IMAGE_SOURCE_DIR, filename);
    if (!fs.existsSync(srcPath)) {
      console.log(`⏭️  Atlanıyor ${filename}: Dosya bulunamadı`);
      skipped++;
      continue;
    }

    const ext = path.extname(filename);
    if (!PRODUCT_IMAGE_EXTENSIONS.includes(ext.toLowerCase())) {
      console.log(`⏭️  Atlanıyor ${filename}: Desteklenmeyen format`);
      skipped++;
      continue;
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const baseName = path.basename(filename, ext).replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
    const destFilename = `${baseName}-${uniqueSuffix}${ext}`;
    const destPath = path.join(UPLOAD_DEST_DIR, destFilename);

    fs.copyFileSync(srcPath, destPath);
    const url = `/uploads/products/${destFilename}`;

    if (config.isPrimary) {
      await prisma.productPhoto.updateMany({
        where: { productId: config.productId, isPrimary: true },
        data: { isPrimary: false },
      });
    }

    await prisma.productPhoto.create({
      data: {
        url,
        productId: config.productId,
        isPrimary: config.isPrimary ?? false,
        displayOrder: config.displayOrder ?? 0,
        altText: config.altText ?? path.basename(filename, ext),
      },
    });

    console.log(`✅ ${filename} -> Ürün #${config.productId} (${url})`);
    imported++;
  }

  console.log(`\n✨ Tamamlandı: ${imported} görsel eklendi, ${skipped} atlandı.`);
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
