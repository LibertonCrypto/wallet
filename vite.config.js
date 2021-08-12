import path from 'path'
import process from 'process'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'
import { base64 } from 'rollup-plugin-base64'

const target = process.env.BUNDLE_TARGET || 'default'

const manifestCopy = (t) => {
  const sourceFile = {
    default: 'base.json',
    chrome: 'base.json', // TODO: v3 WASM support
  }[t]

  return {
    dest: 'public',
    rename: 'manifest.json',
    src: `manifest/${sourceFile}`,
  }
}

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

        manifestCopy(target),
      ],
      hook: 'buildStart',
    }),
  ],
})
