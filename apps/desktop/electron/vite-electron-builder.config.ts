import { defineConfig } from 'vite';
import { resolve } from 'path';

// Vite config for Electron main process
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
  build: {
    outDir: 'dist-electron',
    lib: {
      entry: resolve(__dirname, './main.ts'),
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['electron'],
    },
  },
});

