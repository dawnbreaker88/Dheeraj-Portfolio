import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three'
            if (id.includes('@react-three')) return 'r3f'
            if (id.includes('gsap') || id.includes('@gsap')) return 'gsap'
            if (id.includes('framer-motion')) return 'framer'
            return 'vendor'
          }
        },
      },
    },
  },
})
