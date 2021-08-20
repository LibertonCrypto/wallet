import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'
import { version } from './package.json'
import { base64 } from 'rollup-plugin-base64'

export default defineConfig({
  build: {
    // target: 'es6',
    polyfillDynamicImport: false,
  },
  resolve: {
    alias: {
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/features': path.resolve(__dirname, 'src/features'),
    },
  },
  plugins: [
    base64({ include: '**/*.tvc' }),
    vue(),

    copy({
      targets: [
        {
          dest: 'public',
          src: 'node_modules/@tonclient/lib-web/tonclient.wasm',
        },

        {
          dest: 'public',
          rename: 'manifest.json',
          src: `manifest/base.json`,
          transform: (content) =>
            content.toString().replace('%version%', version),
        },
      ],
      hook: 'buildStart',
    }),
  ],
})
