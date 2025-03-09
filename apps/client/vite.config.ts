import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 端口号
    open: true, // 自动打开浏览器
    // 关闭 页面报错提示
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api/v1': {
        target: 'http://localhost:3005',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api\/v1/, ''),
      },
      '/get-file': {
        target: 'http://localhost:3005',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'server/*': path.resolve(__dirname, '../server/src'),
      'server-mdl/*': path.resolve(__dirname, '../server/src/modules'),
    },
  },
});
