import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    holdUntilCrawlEnd: false,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://app.neogenworld.com',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
