import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      // FIX: __dirname is not available in ES modules. Using import.meta.url provides an alternative for resolving the path.
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
});