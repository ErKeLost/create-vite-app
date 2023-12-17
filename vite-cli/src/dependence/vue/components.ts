const tinyVue = {
  name: '@opentiny/vue',
  version: '^3.12.1',
  stableVersion: '3.12.1',
  dev: 'pro'
}

const elementPlus = {
  name: 'element-plus',
  version: '^2.4.4',
  stableVersion: '2.4.4',
  theme: true,
  unpluginResolver: 'ElementPlusResolver',
  useUnpluginResolver: true,
  dev: 'pro'
}

const antDesignVue = {
  name: 'ant-design-vue',
  version: '^4.0.7',
  stableVersion: '4.0.7',
  theme: true,
  unpluginResolver: 'AntDesignVueResolver',
  useUnpluginResolver: false,
  dev: 'pro'
}

const naiveUI = {
  name: 'naive-ui',
  version: '^2.35.0',
  stableVersion: '2.35.0',
  theme: true,
  unpluginResolver: 'NaiveUiResolver',
  useUnpluginResolver: true,
  dev: 'pro'
}

const devUI = {
  name: 'vue-devui',
  version: '^1.6.0',
  stableVersion: '^1.6.0',
  theme: false,
  unpluginResolver: 'DevUiResolver',
  useUnpluginResolver: true,
  dev: 'pro'
}

const tencent = {
  name: 'tdesign-vue-next',
  version: '^1.7.1',
  stableVersion: '^1.7.1',
  theme: false,
  unpluginResolver: 'TDesignResolver',
  useUnpluginResolver: true,
  dev: 'pro'
}

const vuetify = {
  name: 'vuetify',
  version: '^3.4.7',
  stableVersion: '^3.4.7',
  theme: false,
  unpluginResolver: 'VuetifyResolver',
  useUnpluginResolver: false,
  dev: 'pro'
}

const arco = {
  name: '@arco-design/web-vue',
  version: '^2.53.3',
  stableVersion: '^2.53.3',
  theme: false,
  unpluginResolver: 'ArcoResolver',
  useUnpluginResolver: true,
  dev: 'pro'
}

// mobile
const varlet = {
  name: '@varlet/ui',
  version: '^2.20.1',
  stableVersion: '^2.20.1',
  theme: false,
  unpluginResolver: 'VarletUIResolver',
  dev: 'pro'
}

const vant = {
  name: 'vant',
  version: '^4.8.0',
  stableVersion: '^4.8.0',
  theme: false,
  unpluginResolver: 'VantUIResolver',
  dev: 'pro'
}

const shuimo = {
  name: 'shuimo-ui',
  version: '^0.3.0-alpha.8',
  stableVersion: '^0.3.0-alpha.8',
  theme: false,
  dev: 'pro'
}
export {
  varlet,
  tinyVue,
  arco,
  vuetify,
  tencent,
  devUI,
  naiveUI,
  antDesignVue,
  elementPlus,
  vant,
  shuimo
}
