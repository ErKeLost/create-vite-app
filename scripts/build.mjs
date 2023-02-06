import * as esbuild from 'esbuild'
import chalk from 'chalk'
import chokidar from 'chokidar'

const watcher = chokidar.watch('file, dir, glob, or array', {
  ignored: /(^|[\/\\])\../,
  persistent: true
})

await esbuild.build({
  bundle: true,
  entryPoints: ['vite-cli/src/index.ts'],
  outfile: 'vite-cli/outfile.cjs',
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
        build.onLoad({ filter: /.*/ }, (args) => {
          // watcher
          //   .on('add', (path) => console.log(`File ${path} has been added`))
          //   .on('change', (path) =>
          //     console.log(`File ${path} has been changed`)
          //   )
          //   .on('unlink', (path) =>
          //     console.log(`File ${path} has been removed`)
          //   )
          //   .on('addDir', (path) =>
          //     console.log(`Directory ${path} has been added`)
          //   )
          //   .on('unlinkDir', (path) =>
          //     console.log(`Directory ${path} has been removed`)
          //   )
          //   .on('error', (error) => console.log(`Watcher error: ${error}`))
          //   .on('ready', () =>
          //     console.log('Initial scan complete. Ready for changes')
          //   )
          //   .on('all', (event, path) => console.log(event, path))
          //   .on('raw', (event, path, details) => {
          //     log('Raw event info:', event, path, details)
          //   })
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
