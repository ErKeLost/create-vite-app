import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts'],
  target: 'esnext',
  format: ['esm', 'cjs', 'iife'],
  splitting: false,
  sourcemap: true,
  clean: true
})
// TODO 钩子函数 打包之后 复制template 和 theme 文件夹 保证开发环境 实时调试
