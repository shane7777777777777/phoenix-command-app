import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    // Disable inline module preload polyfill to allow CSP script-src
    // without 'unsafe-inline'. Modern browsers support modulepreload natively.
    modulePreload: { polyfill: false }
  },
  root: __dirname
})

