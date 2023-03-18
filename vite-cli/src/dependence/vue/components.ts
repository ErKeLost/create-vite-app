const elementPlus = {
  name: 'element-plus',
  version: '^2.3.0',
  stableVersion: '2.2.27',
  theme: true,
  unpluginResolver: 'ElementPlusResolver',
  useUnpluginResolver: true,
  dev: 'pro'
}
const antDesignVue = {
  name: 'ant-design-vue',
  version: '^3.2.14',
  stableVersion: '3.2.1',
  theme: true,
  unpluginResolver: 'AntDesignVueResolver',
  useUnpluginResolver: false,
  dev: 'pro'
}
const naiveUI = {
  name: 'naive-ui',
  version: '^2.34.3',
  stableVersion: '2.31.0',
  theme: true,
  unpluginResolver: 'NaiveUiResolver',
  useUnpluginResolver: true,
  dev: 'pro'
}
const devUI = {
  name: 'vue-devui',
  version: '^1.5.2',
  stableVersion: '^1.0.0-rc.14',
  theme: false,
  unpluginResolver: 'DevUiResolver',
  useUnpluginResolver: true,
  dev: 'pro'
}
const tencent = {
  name: 'tdesign-vue-next',
  version: '^1.2.1',
  stableVersion: '^0.18.0',
  theme: false,
  unpluginResolver: 'TDesignResolver',
  useUnpluginResolver: true,
  dev: 'pro'
}
const vuetify = {
  name: 'vuetify',
  version: '^3.1.10',
  stableVersion: '^3.0.5',
  theme: false,
  unpluginResolver: 'VuetifyResolver',
  useUnpluginResolver: false,
  dev: 'pro'
}
const arco = {
  name: '@arco-design/web-vue',
  version: '^2.44.2',
  stableVersion: '^2.33.0',
  theme: false,
  unpluginResolver: 'ArcoResolver',
  useUnpluginResolver: true,
  dev: 'pro'
}

// mobile
const varlet = {
  name: '@varlet/ui',
  version: '^2.9.1',
  stableVersion: '^2.0.2',
  theme: false,
  unpluginResolver: 'VarletUIResolver',
  dev: 'pro'
}

const vant = {
  name: 'vant',
  version: '^4.1.0',
  stableVersion: '^1.27.17',
  theme: false,
  unpluginResolver: 'VantUIResolver',
  dev: 'pro'
}

export {
  varlet,
  arco,
  vuetify,
  tencent,
  devUI,
  naiveUI,
  antDesignVue,
  elementPlus,
  vant
}
