import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitedgePlugin from 'vitedge/plugin.js'
import postcss from './postcss.config.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vitedgePlugin({
    build: {
      keepIndexHtml: true,
    },
  }), vue()],
  css: {
    postcss,
  },
})
