import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'public/dist',
    emptyDirOnBuild: true,
    rollupOptions: {
      input: {
        loan_calculator: resolve(__dirname, 'src/loan_calculator/react/index.tsx'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        // Prevent code splitting to avoid ES module issues with non-module scripts
        inlineDynamicImports: false,
        manualChunks: undefined
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['test/**/*.test.{js,jsx,ts,tsx}'],
    // Run E2E tests sequentially to avoid port conflicts
    fileParallelism: false,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'test/',
        'public/',
        'routes/',
        'views/',
        '**/*.d.ts',
        'src/**/index.tsx'  // Entry points don't need coverage
      ]
    }
  }
});
