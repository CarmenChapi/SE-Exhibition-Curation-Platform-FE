import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/


export default defineConfig({
  plugins: [react()],
  test: {
    // Le dice a Vitest que simule un navegador
    environment: 'jsdom',
    // Permite usar describe, test, expect sin importarlos en cada archivo (opcional)
    globals: true, 
    // Archivo de configuración inicial para los matchers personalizados de jest-dom
    setupFiles: './src/setupTests.js', 
  },
});