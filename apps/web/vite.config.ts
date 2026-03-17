import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  esbuild: {
    drop: ['console', 'debugger'],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      devOptions: {
        enabled: true,
        type: 'module'
      },
      includeAssets: ['favicon.svg', 'favicon.png', 'logo-dark.png', 'logo-white.png'],
      manifest: {
        name: 'DC Protein Shop',
        short_name: 'DC Protein',
        description: 'DC Protein Shop - Kaliteli protein ve spor ürünleri',
        id: '/',
        start_url: '/',
        scope: '/',
        theme_color: '#1a1a1a',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        categories: ['shopping', 'health', 'fitness'],
        icons: [
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'favicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        screenshots: [
          {
            src: 'logo-dark.png',
            sizes: '171x38',
            type: 'image/png',
            form_factor: 'wide',
            label: 'DC Protein Shop Desktop'
          },
          {
            src: 'logo-dark.png',
            sizes: '171x38',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'DC Protein Shop Mobile'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 86400
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 86400
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          // Admin pages in separate chunk
          'admin': [
            './src/pages/admin/AdminDashboard.tsx',
            './src/pages/admin/ProductManagement.tsx',
            './src/pages/admin/CategoryManagement.tsx',
            './src/pages/admin/ProductCreatePage.tsx',
            './src/pages/admin/ProductEditPage.tsx',
            './src/pages/admin/OrderManagement.tsx',
            './src/pages/admin/CommentManagement.tsx',
            './src/pages/admin/ShippingManagement.tsx',
          ],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // esbuild: terser'dan daha az RAM kullanır (EC2/düşük RAM için)
    minify: 'esbuild',
    // Source maps for debugging (disable in production)
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
