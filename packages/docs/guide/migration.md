# Migration from v2

## Node Support

Vite no longer supports Node v12, which reached its EOL. Node 14.18+ is now required.

## Modern Browser Baseline change

The production bundle assumes support for modern JavaScript. By default, Vite targets browsers which support the [native ES Modules](https://caniuse.com/es6-module) and [native ESM dynamic import](https://caniuse.com/es6-module-dynamic-import) and [`import.meta`](https://caniuse.com/mdn-javascript_statements_import_meta):

- Chrome >=87
- Firefox >=78
- Safari >=13
- Edge >=88

A small fraction of users will now require using [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy), which will automatically generate legacy chunks and corresponding ES language feature polyfills.

## Config Options Changes

- The following options that were already deprecated in v2 have been removed:

  - `alias` (switch to [`resolve.alias`](../config/shared-options.md#resolve-alias))
  - `dedupe` (switch to [`resolve.dedupe`](../config/shared-options.md#resolve-dedupe))
  - `build.base` (switch to [`base`](../config/shared-options.md#base))
  - `build.brotliSize` (switch to [`build.reportCompressedSize`](../config/build-options.md#build-reportcompressedsize))
  - `build.cleanCssOptions` (Vite now uses esbuild for CSS minification)
  - `build.polyfillDynamicImport` (use [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) for browsers without dynamic import support)
  - `optimizeDeps.keepNames` (switch to [`optimizeDeps.esbuildOptions.keepNames`](../config/dep-optimization-options.md#optimizedeps-esbuildoptions))

## Architecture changes and legacy Options

This section describes the biggest architecture changes in Vite v3. To allow projects to migrate from v2 in case of a compat issue, legacy options have been added to revert to the Vite v2 strategies.

:::warning
These options are marked as experimental and deprecated. They may be removed in a future v3 minor without respecting semver. Please pin the Vite version when using them.

- `legacy.buildRollupPluginCommonjs`
- `legacy.buildSsrCjsExternalHeuristics`

:::

### Dev Server Changes

Vite's default dev server port is now 5173. You can use [`server.port`](../config/server-options.md#server-port) to set it to 3000.

Vite's default dev server host is now `localhost`. You can use [`server.host`](../config/server-options.md#server-host) to set it to `127.0.0.1`.

### Build Changes

In v3, Vite uses esbuild to optimize dependencies by default. Doing so, it removes one of the most significant differences between dev and prod present in v2. Because esbuild converts CJS-only dependencies to ESM, [`@rollupjs/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs) is no longer used.

If you need to get back to the v2 strategy, you can use `legacy.buildRollupPluginCommonjs`.

### SSR Changes

Vite v3 uses ESM for the SSR build by default. When using ESM, the [SSR externalization heuristics](https://vitejs.dev/guide/ssr.html#ssr-externals) are no longer needed. By default, all dependencies are externalized. You can use [`ssr.noExternal`](../config/ssr-options.md#ssr-noexternal) to control what dependencies to include in the SSR bundle.

If using ESM for SSR isn't possible in your project, you can set `legacy.buildSsrCjsExternalHeuristics` to generate a CJS bundle using the same externalization strategy of Vite v2.

Also [`build.rollupOptions.output.inlineDynamicImports`](https://rollupjs.org/guide/en/#outputinlinedynamicimports) now defaults to `false` when `ssr.target` is `'node'`. `inlineDynamicImports` changes execution order and bundling to a single file is not needed for node builds.

## General Changes

- JS file extensions in SSR and lib mode now use a valid extension (`js`, `mjs`, or `cjs`) for output JS entries and chunks based on their format and the package type.
- Terser is now an optional dependency. If you are using `build.minify: 'terser'`, you need to install it.
  ```shell
  npm add -D terser
  ```

### `import.meta.glob`

- [Raw `import.meta.glob`](features.md#glob-import-as) switched from `{ assert: { type: 'raw' }}` to `{ as: 'raw' }`
- Keys of `import.meta.glob` are now relative to the current module.

  ```diff
  // file: /foo/index.js
  const modules = import.meta.glob('../foo/*.js')

  // transformed:
  const modules = {
  -  '../foo/bar.js': () => {}
  +  './bar.js': () => {}
  }
  ```

- When using an alias with `import.meta.glob`, the keys are always absolute.
- `import.meta.globEager` is now deprecated. Use `import.meta.glob('*', { eager: true })` instead.

### WebAssembly support

`import init from 'example.wasm'` syntax is dropped to prevent future collision with ["ESM integration for Wasm"](https://github.com/WebAssembly/esm-integration).
You can use `?init` which is similar to the previous behavior.

```diff
-import init from 'example.wasm'
+import init from 'example.wasm?init'

-init().then((exports) => {
+init().then(({ exports }) => {
  exports.test()
})
```

## Advanced

There are some changes which only affects plugin/tool creators.

- [[#5868] refactor: remove deprecated api for 3.0](https://github.com/vitejs/vite/pull/5868)
  - `printHttpServerUrls` is removed
  - `server.app`, `server.transformWithEsbuild` are removed
  - `import.meta.hot.acceptDeps` is removed
- [[#6901] fix: sequential injection of tags in transformIndexHtml](https://github.com/vitejs/vite/pull/6901)
  - `transformIndexHtml` now gets the correct content modified by earlier plugins, so the order of the injected tags now works as expected.
- [[#7995] chore: do not fixStacktrace](https://github.com/vitejs/vite/pull/7995)
  - `ssrLoadModule`'s `fixStacktrace` option's default is now `false`
- [[#8178] feat!: migrate to ESM](https://github.com/vitejs/vite/pull/8178)
  - `formatPostcssSourceMap` is now async
  - `resolvePackageEntry`, `resolvePackageData` are no longer available from CJS build (dynamic import is needed to use in CJS)
- [[#8626] refactor: type client maps](https://github.com/vitejs/vite/pull/8626)
  - Type of callback of `import.meta.hot.accept` is now stricter. It is now `(mod: (Record<string, any> & { [Symbol.toStringTag]: 'Module' }) | undefined) => void` (was `(mod: any) => void`).

Also there are other breaking changes which only affect few users.

- [[#5018] feat: enable `generatedCode: 'es2015'` for rollup build](https://github.com/vitejs/vite/pull/5018)
  - Transpile to ES5 is now necessary even if the user code only includes ES5.
- [[#7877] fix: vite client types](https://github.com/vitejs/vite/pull/7877)
  - `/// <reference lib="dom" />` is removed from `vite/client.d.ts`. `{ "lib": ["dom"] }` or `{ "lib": ["webworker"] }` is necessary in `tsconfig.json`.
- [[#8090] feat: preserve process env vars in lib build](https://github.com/vitejs/vite/pull/8090)
  - `process.env.*` is now preserved in library mode
- [[#8280] feat: non-blocking esbuild optimization at build time](https://github.com/vitejs/vite/pull/8280)
  - `server.force` option was removed in favor of `optimizeDeps.force` option.
- [[#8550] fix: dont handle sigterm in middleware mode](https://github.com/vitejs/vite/pull/8550)
  - When running in middleware mode, Vite no longer kills process on `SIGTERM`.
- [[#8647] feat: print resolved address for localhost](https://github.com/vitejs/vite/pull/8647)
  - `server.printUrls` and `previewServer.printUrls` are now async

## Migration from v1

Check the [Migration from v1 Guide](https://v2.vitejs.dev/guide/migration.html) in the Vite v2 docs first to see the needed changes to port your app to Vite v2, and then proceed with the changes on this page.
