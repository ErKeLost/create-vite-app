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
  if (Array.isArray(features[item].name)) {
    let res = ''
    features[item].name.forEach((cur, index) => {
      res += `"${cur}":"${features[item].version[index]}",`
    })
    featureMap.set(item, res)
  } else {
    featureMap.set(
      item,
      `"${features[item].name}":"${features[item].version}",`
    )
  }
})

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

const pluginImportStatement = new Map()
const pluginMap = new Map()
Object.keys(plugins).forEach((item) => {
  if (Array.isArray(plugins[item].name)) {
    let res = ''
    let stateMent = ''
    plugins[item].name.forEach((cur, index) => {
      res += `"${cur}":"${plugins[item].version[index]}",`
      stateMent += `${plugins[item].stateMent[index]};`
    })
    pluginMap.set(item, res)
    pluginImportStatement.set(item, stateMent)
  } else {
    pluginMap.set(item, `"${plugins[item].name}":"${plugins[item].version}",`)
    pluginImportStatement.set(item, `${plugins[item].stateMent};`)
  }
})

const useThemeUiMap = ['elementPlus', 'antDesignVue', 'naiveUI']
const notComponentResolverMap = ['vuetify', 'ant-design']

export {
  componentsMap,
  lintMap,
  featureMap,
  pluginMap,
  componentResolverMap,
  notComponentResolverMap,
  pluginImportStatement,
  useThemeUiMap
}
