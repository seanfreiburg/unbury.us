import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'public/dist',
    emptyDirOnBuild: true,
    rollupOptions: {
      input: {
        loan_calculator: resolve(__dirname, 'src/loan_calculator/main.js'),
        fi_calculator: resolve(__dirname, 'src/fi_calculator/main.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['test/**/*.test.js'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'test/']
    }
  }
});
