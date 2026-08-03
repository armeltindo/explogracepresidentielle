/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves project sites under /<repo>/ — the deploy workflow sets
// GITHUB_PAGES=true so `npm run build` locally and on other hosts (Netlify,
// Vercel, ...) keeps using root-relative paths.
const base = process.env.GITHUB_PAGES ? '/explogracepresidentielle/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
})
