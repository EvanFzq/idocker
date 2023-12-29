/* eslint-env node */

import path from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  envDir: path.resolve(__dirname, '../../'),
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'iDocker',
        short_name: 'iDocker',
        description: 'Docker client for Mobile',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/img/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
    visualizer({
      // 打包完成后自动打开浏览器，显示产物体积报告
      open: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any,
  ],
  resolve: {
    alias: {
      '@/': path.join(__dirname, 'src') + '/',
      '@common/': path.join(__dirname, '..', 'common') + '/',
    },
  },
  server: {
    port: 3500,
    strictPort: true,
    watch: {
      ignored: ['**/dist/*'],
    },
    proxy: {
      '/api': 'http://localhost:3580',
      '/socket.io': {
        target: 'ws://localhost:3580',
        ws: true,
      },
    },
    open: 'http://localhost:3500',
  },
});
