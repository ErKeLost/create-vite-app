import { defineConfig } from 'vite'
// # prepare
export default defineConfig({
  // ssr: {
  //   format: 'cjs'
  // },
  // legacy: {
  //   buildSsrCjsExternalHeuristics: true
  // }
  css: { preprocessorOptions: { scss: { charset: false } } }
})
