import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'resolve-static-assets',
      resolveId(id) {
        // Treat /icons/, /fonts/, and other static asset paths as external
        if (id.startsWith('/icons/') || id.startsWith('/fonts/') || id.startsWith('/images/') || id.startsWith('/videos/') || id.startsWith('/audio/')) {
          return { id, external: true }
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  publicDir: 'public',
  assetsInclude: ['**/*.svg', '**/*.otf', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp', '**/*.mp4', '**/*.webm', '**/*.ogg', '**/*.mp3', '**/*.wav', '**/*.flac', '**/*.aac', '**/*.woff', '**/*.woff2', '**/*.eot', '**/*.ttf'],
  server: {
    port: 3000,
    host: true,
  },
}) 