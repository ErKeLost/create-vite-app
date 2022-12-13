import * as esbuild from 'esbuild'
import chalk from 'chalk'
await esbuild.build({
  bundle: true,
  entryPoints: ['packages/vite-cli/src/index.ts'],
  outfile: 'packages/vite-cli/outfile.cjs',
  format: 'cjs',
  platform: 'node',
  target: 'node16',
  external: ['prettier'],
  treeShaking: true,
  watch: true,
  // minify: true,
  plugins: [
    {
      name: 'start',
      setup(build) {
        build.onEnd(() => {
          console.log(
            chalk.magenta('[create-vite-app]:'),
            chalk.blue('esbuild code refresh listener'),
            chalk.yellow('')
          )
          console.log(
            chalk.magenta('[create-vite-app]:'),
            chalk.blue('refresh rebuild success'),
            chalk.yellow('')
          )
        })
      }
    },
    {
      name: 'alias',
      setup({ onResolve, resolve }) {
        onResolve(
          { filter: /^prompts$/, namespace: 'file' },
          async ({ importer, resolveDir }) => {
            const result = await resolve('prompts/lib/index.js', {
              importer,
              resolveDir
            })
            return result
          }
        )
      }
    }
  ]
})
