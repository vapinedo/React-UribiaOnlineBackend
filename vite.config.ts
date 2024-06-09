import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/React-UribiaOnlineBackend/',
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      '@app': '/src',
      '@mocks': '/src/mocks',
      '@hooks': '/src/hooks',
      '@stores': '/src/stores',
      '@routes': '/src/routes',
      '@models': '/src/models',
      '@layouts': '/src/layouts',
      '@features': '/src/features',
      '@services': '/src/services',
      '@components': '/src/components',
      '@firebaseConfig': '/src/firebaseConfig',
    },
  },
});