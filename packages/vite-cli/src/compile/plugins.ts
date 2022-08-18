const jsx = {
  name: '@vitejs/plugin-vue-jsx',
  version: '^2.0.0',
  stableVersion: '^2.0.0',
  stateMent: 'import VueJsx from "@vitejs/plugin-vue-jsx"'
}

const legacy = {
  name: '@vitejs/plugin-legacy',
  version: '^2.0.0',
  stableVersion: '^2.0.0',
  stateMent: 'import legacy from "@vitejs/plugin-legacy"'
}

const html = {
  name: 'vite-plugin-html',
  version: '^3.2.0',
  stableVersion: '^3.2.0',
  stateMent: 'import html from "vite-plugin-html"'
}

const unocss = {
  name: 'unocss',
  version: '^0.44.5',
  stableVersion: '^0.44.5',
  stateMent: 'import Unocss from "unocss/vite"'
}

const autoImport = {
  name: 'unplugin-auto-import',
  version: '^0.10.0',
  stableVersion: '^0.10.0',
  stateMent: 'import AutoImport from "unplugin-auto-import/vite"'
}

const vueComponents = {
  name: 'unplugin-vue-components',
  version: '^0.21.1',
  stableVersion: '^0.21.1',
  stateMent: 'import Components from "unplugin-vue-components/vite"'
}

const visualizer = {
  name: 'rollup-plugin-visualizer',
  version: '^5.7.1',
  stableVersion: '^5.7.1',
  stateMent: 'import AutoImport from "unplugin-auto-import/vite"'
}

const pwa = {
  name: 'vite-plugin-pwa',
  version: '^0.6.0',
  stableVersion: '^0.6.0',
  stateMent: 'import pwa from "vite-plugin-pwa"'
}

const icons = {
  name: ['unplugin-icons', '@iconify/json'],
  version: ['^0.14.7', '^2.1.74'],
  stableVersion: ['^0.14.7', '^2.1.74'],
  stateMent: [
    'import Icons from "unplugin-icons/vite"',
    'import IconsResolver from "unplugin-icons/resolver"'
  ]
}

const inspect = {
  name: 'vite-plugin-inspect',
  version: '^0.14.7',
  stableVersion: '^0.14.7',
  stateMent: 'import Inspect from "vite-plugin-inspect"'
}

export {
  inspect,
  icons,
  legacy,
  html,
  jsx,
  vueComponents,
  autoImport,
  unocss,
  pwa,
  visualizer
}
