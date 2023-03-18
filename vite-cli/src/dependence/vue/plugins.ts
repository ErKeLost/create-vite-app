const jsx = {
  name: '@vitejs/plugin-vue-jsx',
  version: '^3.0.1',
  stableVersion: '^2.0.0',
  stateMent: 'import VueJsx from "@vitejs/plugin-vue-jsx"',
  dev: 'dev'
}

const legacy = {
  name: '@vitejs/plugin-legacy',
  version: '^4.0.2',
  stableVersion: '^2.0.0',
  stateMent: 'import legacy from "@vitejs/plugin-legacy"',
  dev: 'dev'
}

const vuetifyPlugin = {
  name: 'vite-plugin-vuetify',
  version: '^1.0.2',
  stableVersion: '^1.0.0',
  stateMent: 'import vuetify from "vite-plugin-vuetify',
  dev: 'dev'
}

const html = {
  name: 'vite-plugin-html',
  version: '^3.2.0',
  stableVersion: '^3.2.0',
  stateMent: 'import html from "vite-plugin-html"',
  dev: 'dev'
}

const unocss = {
  name: 'unocss',
  version: '^0.50.6',
  stableVersion: '^0.45.18',
  stateMent: 'import Unocss from "unocss/vite"',
  dev: 'dev'
}

const autoImport = {
  name: 'unplugin-auto-import',
  version: '^0.15.1',
  stableVersion: '^0.10.0',
  stateMent: 'import AutoImport from "unplugin-auto-import/vite"',
  dev: 'dev'
}

const pwa = {
  name: 'vite-plugin-pwa',
  version: '^0.14.4',
  stableVersion: '^0.14.0',
  stateMent: 'import { VitePWA } from "vite-plugin-pwa"',
  dev: 'dev'
}

const vueComponents = {
  name: 'unplugin-vue-components',
  version: '^0.24.1',
  stableVersion: '^0.21.1',
  stateMent: 'import Components from "unplugin-vue-components/vite"',
  dev: 'dev'
}

const visualizer = {
  name: 'rollup-plugin-visualizer',
  version: '^5.9.0',
  stableVersion: '^5.7.1',
  stateMent: 'import AutoImport from "unplugin-auto-import/vite"',
  dev: 'dev'
}

const icons = {
  name: ['unplugin-icons', '@iconify-json/carbon'],
  version: ['^0.15.3', '^1.1.16'],
  stableVersion: ['^0.14.7', '^1.1.13'],
  stateMent: [
    'import Icons from "unplugin-icons/vite"',
    'import IconsResolver from "unplugin-icons/resolver"'
  ],
  dev: 'dev'
}

const inspect = {
  name: 'vite-plugin-inspect',
  version: '^0.7.17',
  stableVersion: '^0.6.0',
  stateMent: 'import Inspect from "vite-plugin-inspect"',
  dev: 'dev'
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
  visualizer,
  vuetifyPlugin
}
