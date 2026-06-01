import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:4174'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
