import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  publicDir: 'public',
  server: {
    port: 3000,
    host: true,
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: (id) => {
        // Treat all /icons/ and /fonts/ paths as external (not bundled)
        return id.startsWith('/icons/') || id.startsWith('/fonts/')
      },
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['@atlaskit/icon', '@atlaskit/button'],
        },
      },
    },
  },
}) 