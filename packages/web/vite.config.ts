/* eslint-env node */

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    root: __dirname,
    envDir: path.resolve(__dirname, '../../'),
    plugins: [vue()],
    resolve: {
        alias: {
            '@/': path.join(__dirname, 'src') + '/',
            '@common/': path.join(__dirname, '..', 'common') + '/',
        },
    },
    server: {
        watch: {
            ignored: ['**/dist/*'],
        },
    },
});
