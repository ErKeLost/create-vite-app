# SSR Options

- **Related:** [SSR Externals](/guide/ssr#ssr-externals)

:::warning Experimental
SSR options may be adjusted in minor releases.
:::

## ssr.external

- **Type:** `string[]`

Force externalize dependencies for SSR.

## ssr.noExternal

- **Type:** `string | RegExp | (string | RegExp)[] | true`

Prevent listed dependencies from being externalized for SSR. If `true`, no dependencies are externalized.

## ssr.target

- **Type:** `'node' | 'webworker'`
- **Default:** `node`

Build target for the SSR server.

## ssr.format

- **Type:** `'esm' | 'cjs'`
- **Default:** `esm`
- **Experimental**

Build format for the SSR server. Since Vite v3 the SSR build generates ESM by default. `'cjs'` can be selected to generate a CJS build, but it isn't recommended. The option is left marked as experimental to give users more time to update to ESM. CJS builds requires complex externalization heuristics that aren't present in the ESM format.
