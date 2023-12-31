import path from 'path';

import { swcPlugin } from 'electron-vite';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PACKAGE_ROOT,
  resolve: {
    alias: {
      '@/': path.join(PACKAGE_ROOT, 'src') + '/',
      '@common/': path.join(__dirname, '..', 'common') + '/',
    },
  },
  build: {
    ssr: true,
    sourcemap: 'inline',
    target: 'node18',
    outDir: 'dist',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: './index.ts',
      formats: ['cjs'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].cjs',
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
  plugins: [swcPlugin()],
};

export default config;
