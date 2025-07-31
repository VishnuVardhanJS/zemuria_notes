import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true, // so you don't need to import test/expect
    setupFiles: './setupTest.js', // path to setup file
  },
})
