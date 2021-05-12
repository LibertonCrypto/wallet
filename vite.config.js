import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'
import eslint from "@rollup/plugin-eslint"
import { base64 } from 'rollup-plugin-base64'

export default defineConfig({
  build: {
    // target: 'es6',
    polyfillDynamicImport: false,
  },
  resolve: {
    alias: [
      { find: '@utils', replacement: path.resolve(__dirname, './src/utils')  }
    ],
  },
  plugins: [
    base64({ include: "**/*.tvc" }),
    vue(),
    {
      ...eslint({
        fix: true,
      }),
      enforce: 'pre',
      apply: 'serve',
    },
    copy({
      targets: [
        {
          dest: 'public',
          src: path.resolve(__dirname, './node_modules/@tonclient/lib-web/tonclient.wasm'),
        },
      ],
      hook: 'buildStart',
    })
  ]
})
