import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base public path
  base: './',

  // Build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,

    // Multi-page app configuration
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
        services: resolve(__dirname, 'services/index.html'),
        projects: resolve(__dirname, 'projects/index.html'),
        ai: resolve(__dirname, 'ai/index.html'),
        demo: resolve(__dirname, 'ai/demo/index.html'),
      },
    },

    // Asset handling
    assetsInlineLimit: 4096, // 4kb - inline smaller assets
    cssCodeSplit: true,

    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for now
        drop_debugger: true,
        passes: 2,
      },
      format: {
        comments: false,
      },
    },

    // Sourcemaps for debugging (can disable in production)
    sourcemap: false,
  },

  // Server configuration for development
  server: {
    port: 3000,
    open: true,
    cors: true,
  },

  // Preview server (for testing production build)
  preview: {
    port: 4173,
    open: true,
  },
});
