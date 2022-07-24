const componentsMap = new Map()

componentsMap.set('element-plus', '"element-plus": "^2.2.5",')
componentsMap.set('arco', '"@arco-design/web-vue": "^2.33.0",')
componentsMap.set('vuetify', '"vuetify": "^3.0.0-beta.5",')
componentsMap.set('tencent', '"tdesign-vue-next": "^0.18.0",')
componentsMap.set('devui', '"vue-devui": "^1.0.0-rc.14",')
componentsMap.set('ant-design', '"ant-design-vue": "3.2.1",')
componentsMap.set('varlet', '"@varlet/ui": "^1.27.17",')

const futureMap = new Map([
  [
    'Eslint',
    '"lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",'
  ],
  [
    'Prettier',
    '"prettier": "prettier --write ./**/*.{html,vue,ts,js,json,md}"'
  ],
  ['Router', '"vue-router": "^4.1.1",'],
  ['Pinia', '"pinia": "^2.0.14","pinia-plugin-persist": "^1.0.0"']
])
export { componentsMap, futureMap }
