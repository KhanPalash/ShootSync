import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // CRITICAL: Ensures assets load from relative paths in APK
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})