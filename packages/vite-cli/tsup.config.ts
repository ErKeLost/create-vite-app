import { defineConfig } from 'tsup'

export default defineConfig({
  // entry: ['./src/index.ts'],
  // target: 'esnext',
  // format: ['esm', 'cjs', 'iife'],
  // splitting: false,
  // sourcemap: true,
  // clean: true
  bundle: true,
  entry: ['./src/index.ts'],
  // outDir
  output: './outfileTsup.cjs',
  format: 'cjs',
  platform: 'node',
  target: 'node16',
  external: ['prettier'],
  // treeShaking: true,
  watch: true
})
// TODO 钩子函数 打包之后 复制template 和 theme 文件夹 保证开发环境 实时调试
