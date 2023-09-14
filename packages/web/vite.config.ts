/* eslint-env node */

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    root: __dirname,
    envDir: path.resolve(__dirname, '../../'),
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Docker Mobile',
                short_name: 'Docker Mobile',
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
        },
        open: 'http://localhost:3500',
    },
});
