import * as components from '@/compile/vueComponents'
import * as features from '@/compile/features'
import * as plugins from '@/compile/plugins'
// 核心逻辑还是拼接 package.json中的字符串 模板还是写死
function removeBlock(str: string) {
  if (str) {
    str = str.replace(/\[|]/g, '')
    str = str.replace(/\{|}/g, '')
    return str
  }
  throw new Error('str not string type')
}
// componetsUI library map
const componentsMap = new Map()
Object.keys(components).forEach((item) => {
  componentsMap.set(
    item,
    `"${components[item].name}":"${components[item].version}",`
  )
})

// unpluginVueComponents map
const componentResolverMap = new Map([])
Object.keys(components).forEach((item) => {
  componentResolverMap.set(item, `${components[item].unpluginResolver}`)
})

const featureMap = new Map()
Object.keys(features).forEach((item) => {
  if (Array.isArray(features[item])) {
    featureMap.set(item, removeBlock(JSON.stringify(features[item])))
  } else {
    featureMap.set(
      item,
      `"${features[item].name}":"${features[item].version}",`
    )
  }
})
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
  ]
])
const pluginMap = new Map()
Object.keys(plugins).forEach((item) => {
  if (Array.isArray(plugins[item].name)) {
    let res = ''
    plugins[item].name.forEach((cur, index) => {
      res += `"${cur}":"${plugins[item].version[index]}",`
    })
    pluginMap.set(item, res)
  } else {
    pluginMap.set(item, `"${plugins[item].name}":"${plugins[item].version}",`)
  }
})
console.log(pluginMap)

// const pluginMap = new Map([
//   ['jsx', '"@vitejs/plugin-vue-jsx": "^2.0.0",'],
//   ['legacy', '"@vitejs/plugin-legacy": "^2.0.0",'],
//   ['html', '"vite-plugin-html": "^3.2.0",'],
//   ['auto-import', '"unplugin-auto-import": "^0.10.0",'],
//   ['vue-components', '"unplugin-vue-components": "^0.21.1",'],
//   ['unocss', '"unocss": "^0.44.5",'],
//   ['visualizer', '"rollup-plugin-visualizer": "^5.7.1",'],
//   ['pwa', '"vite-plugin-pwa": "^0.12.3",'],
//   ['inspect', '"vite-plugin-inspect": "^0.6.0",'],
//   ['icons', '"unplugin-icons": "^0.14.7","@iconify/json": "^2.1.74",']
// ])
// console.log(pluginMap)

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

const useThemeUiMap = ['element-plus', 'ant-design', 'naive-ui']
const notComponentResolverMap = ['vuetify', 'ant-design']

export {
  componentsMap,
  futureMap,
  lintMap,
  pluginMap,
  componentResolverMap,
  notComponentResolverMap,
  pluginImportStatement,
  useThemeUiMap
}
