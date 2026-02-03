import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    // Source maps for debugging (disable in production)
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
