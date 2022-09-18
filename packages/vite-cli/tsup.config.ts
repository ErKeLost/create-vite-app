import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts'],
  target: 'esnext',
  format: ['esm', 'cjs', 'iife'],
  splitting: false,
  sourcemap: true,
  clean: true,
  watch: true,
  plugins: [
    // TODO tsup hook copy template with theme
  ]
})
