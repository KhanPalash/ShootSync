import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['@google/genai', 'html2canvas', 'jspdf'],
      output: {
        globals: {
          '@google/genai': 'GoogleGenAI',
          'html2canvas': 'html2canvas',
          'jspdf': 'jspdf'
        }
      }
    }
  },
})