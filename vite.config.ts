/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // 백엔드가 뜨면 여기만 바꾸면 됩니다. 브라우저에서는 /api 로만 호출.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    // jsdom 에는 브라우저 fetch 가 없어 상대 URL 을 못 풉니다. 테스트에서만 절대 URL.
    env: { VITE_API_BASE_URL: 'http://localhost/api/' },
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
