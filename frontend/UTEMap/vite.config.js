import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: true,
    host: true, // Cho phép truy cập từ thiết bị khác trong mạng
    port: 5173,
    hmr: {
      protocol: 'wss',
      host: 'localhost',
      port: 5173,
      clientPort: 5173
    }
  }
})
