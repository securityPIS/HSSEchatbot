import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // On GitHub Pages the app is served from https://securitypis.github.io/HSSEchatbot/
  // so production assets must be prefixed with the repo name. Local dev stays at root.
  base: command === 'build' ? '/HSSEchatbot/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
}))
