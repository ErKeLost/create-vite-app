import { defineConfig } from 'tsup'
import 'zx/globals'
import { copyDir } from './scripts/dev.mjs'
import fs from 'node:fs'
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
  // output: './outfileTsup.cjs',
  format: ['cjs'],
  platform: 'node',
  target: 'node16',
  external: ['prettier'],
  // treeShaking: true,
  watch: true,
  esbuildPlugins: [
    {
      name: 'copyTemplate',
      setup(build) {
        // build.onEnd(async () => {
        //   if (!(await fs.existsSync('dist'))) {
        //     await fs.mkdirSync('dist')
        //   }
        //   if (await fs.existsSync('dist')) {
        //     copyDir('template', 'dist/template', (err) => {
        //       console.log(err)
        //     })
        //   }
        //   if (await fs.existsSync('dist')) {
        //     copyDir('theme', 'dist/theme', (err) => {
        //       console.log(err)
        //     })
        //   }
        // })
      }
    }
  ]
})
// TODO 钩子函数 打包之后 复制template 和 theme 文件夹 保证开发环境 实时调试
