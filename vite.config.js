/**
 * vite.config.js — Production-optimized Vite config
 *
 * Includes:
 *  - Manual chunk splitting (vendor / socket / maps separate bundles)
 *  - Terser minification with console.log removal in production
 *  - PWA-ready: manifest injected, service worker registration hook
 *
 * To enable full PWA offline support, install:
 *   npm install -D vite-plugin-pwa
 * Then uncomment the VitePWA plugin section below.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';  // ← uncomment after npm install

export default defineConfig({
  plugins: [
    react(),

    // ── PWA plugin (uncomment after: npm install -D vite-plugin-pwa) ──────
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.ico', 'icons/*.png'],
    //   manifest: {
    //     name: 'Bhada Rider',
    //     short_name: 'Bhada Rider',
    //     theme_color: '#00e5a0',
    //     background_color: '#05080f',
    //     display: 'standalone',
    //     icons: [
    //       { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    //       { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    //     ],
    //   },
    //   workbox: {
    //     // Cache static assets
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    //     // Runtime caching for API (network-first, fallback to cache)
    //     runtimeCaching: [
    //       {
    //         urlPattern: /\/api\/v1\/(riders|orders)\/.*/,
    //         handler: 'NetworkFirst',
    //         options: {
    //           cacheName: 'api-cache',
    //           expiration: { maxEntries: 50, maxAgeSeconds: 300 },
    //         },
    //       },
    //     ],
    //   },
    // }),
  ],

  build: {
    // ── Code splitting ───────────────────────────────────────────────────
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — changes rarely, benefits from long-term caching
          'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
          // Socket.IO client — large library, rarely changes
          'vendor-socket': ['socket.io-client'],
          // Toast notifications
          'vendor-toast':  ['react-hot-toast'],
          // Lucide icons
          'vendor-icons':  ['lucide-react'],
        },
      },
    },

    // ── Minification ─────────────────────────────────────────────────────
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove all console.log in production (keep warn/error)
        drop_console: false,
        pure_funcs: ['console.log'],
        passes: 2,
      },
    },

    // ── Source maps ──────────────────────────────────────────────────────
    // Set to 'hidden' in production to enable Sentry source maps without
    // exposing your source to users
    sourcemap: process.env.NODE_ENV === 'development' ? true : 'hidden',

    // Warn if any chunk exceeds 500kb
    chunkSizeWarningLimit: 500,
  },

  // ── Dev server ─────────────────────────────────────────────────────────
  server: {
    port: 3002,
    host: true,
  },
});
