#!/usr/bin/env node
/**
 * apps/web/image/ → apps/web/public/image/ kopyalar.
 * Build/dev öncesi çalışır; Vite public'i dist'e alır.
 * logo-black.zip varsa Header/LOGO_Siyah.png çıkarır.
 */
import { cpSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imageSource = join(__dirname, '..', 'image');
const imageDest = join(__dirname, '..', 'public', 'image');

function extractLogoZip() {
  const zipPath = join(imageSource, 'logo-black.zip');
  if (!existsSync(zipPath)) return;
  try {
    execSync(`unzip -o "${zipPath}" -d "${imageDest}"`, { stdio: 'ignore' });
  } catch {
    // unzip yoksa (Docker Alpine vb.) sessizce devam
  }
}

if (!existsSync(imageSource)) {
  console.warn('⚠️  apps/web/image/ bulunamadı:', imageSource);
} else {
  if (!existsSync(imageDest)) mkdirSync(imageDest, { recursive: true });
  cpSync(imageSource, imageDest, { recursive: true });
  extractLogoZip();
  console.log('✅ Statik görseller public/image/ içine kopyalandı');
}
