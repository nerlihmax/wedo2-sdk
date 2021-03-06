import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';

import pkg from './package.json';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  define: {
    'process.env.NODE_ENV': 'process.env.NODE_ENV',
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      formats: ['cjs', 'es'],
      fileName: (format) => `backend-scratch-link.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies)],
    },
    sourcemap: true,
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'lib'),
      },
    ],
  },
});
