const componentsMap = new Map()

componentsMap.set('element-plus', '"element-plus": "^2.2.5",')
componentsMap.set('arco', '"@arco-design/web-vue": "^2.33.0",')
componentsMap.set('vuetify', '"vuetify": "^3.0.0-beta.5",')
componentsMap.set('naive-ui', '"naive-ui": "^2.31.0",')
componentsMap.set('tencent', '"tdesign-vue-next": "^0.18.0",')
componentsMap.set('devui', '"vue-devui": "^1.0.0-rc.14",')
componentsMap.set('ant-design', '"ant-design-vue": "3.2.1",')
componentsMap.set('varlet', '"@varlet/ui": "^1.27.17",')

const futureMap = new Map([
  ['Router', '"vue-router": "^4.1.1",'],
  ['Pinia', '"pinia": "^2.0.14","pinia-plugin-persist": "^1.0.0"']
])

const lintMap = new Map([
  [
    'EslintScript',
    '"lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",'
  ],
  [
    'PrettierScript',
    '"prettier": "prettier --write ./**/*.{html,vue,ts,js,json,md}"'
  ],
  [
    'EslintWithPrettierScript',
    '"eslint-config-prettier": "^8.5.0","eslint-plugin-prettier": "^4.2.1",'
  ],
  [
    'Eslint',
    '"eslint": "^8.18.0","eslint-plugin-vue": "^9.1.1","@typescript-eslint/eslint-plugin": "^5.30.5","@typescript-eslint/parser": "^5.30.5",'
  ],
  ['Prettier', '"prettier": "^2.7.1",']
])

const pluginMap = new Map([
  ['jsx', '"@vitejs/plugin-vue-jsx": "^2.0.0",'],
  ['legacy', '"@vitejs/plugin-legacy": "^2.0.0",'],
  ['html', '"vite-plugin-html": "^3.2.0",'],
  ['auto-import', '"unplugin-auto-import": "^0.10.0",'],
  ['vue-components', '"unplugin-vue-components": "^0.21.1",'],
  ['unocss', '"unocss": "^0.44.5",'],
  ['visualizer', '"rollup-plugin-visualizer": "^5.7.1",'],
  ['pwa', '"vite-plugin-pwa": "^0.12.3",'],
  ['inspect', '"vite-plugin-inspect": "^0.6.0",'],
  ['icons', '"unplugin-icons": "^0.14.7","@iconify/json": "^2.1.74",']
])

const pluginImportStatement = new Map([
  ['jsx', 'import VueJsx from "@vitejs/plugin-vue-jsx";'],
  ['legacy', 'import legacy from "@vitejs/plugin-legacy";'],
  ['html', 'import html from "vite-plugin-html";'],
  ['unocss', 'import Unocss from "unocss/vite";'],
  ['auto-import', 'import AutoImport from "unplugin-auto-import/vite";'],
  ['vue-components', 'import Components from "unplugin-vue-components/vite";'],
  ['inspect', 'import Inspect from "vite-plugin-inspect";'],
  ['pwa', 'import pwa from "vite-plugin-pwa";'],
  ['visualizer', 'import visualizer from "rollup-plugin-visualizer";'],
  [
    'icons',
    'import Icons from "unplugin-icons/vite"; import IconsResolver from "unplugin-icons/resolver";'
  ]
])
const componentResolverMap = new Map([
  ['element-plus', 'ElementPlusResolver'],
  ['arco', 'ArcoResolver'],
  ['naive-ui', 'NaiveUiResolver'],
  ['tencent', 'TDesignResolver'],
  ['devui', 'DevUiResolver'],
  ['ant-design', 'AntDesignVueResolver'],
  ['varlet', 'VarletUIResolver']
])

export {
  componentsMap,
  futureMap,
  lintMap,
  pluginMap,
  componentResolverMap,
  pluginImportStatement
}
