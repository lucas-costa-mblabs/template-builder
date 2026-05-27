import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'dev'),
  envDir: resolve(__dirname, 'dev'),
  resolve: {
    alias: {
      '@ui': resolve(__dirname),
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist/dev'),
  },
  server: {
    port: 5555,
  },
});
