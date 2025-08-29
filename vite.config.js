import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "https://li4alex.github.io/tspdt-tmdb/",
  plugins: [react()],
})
