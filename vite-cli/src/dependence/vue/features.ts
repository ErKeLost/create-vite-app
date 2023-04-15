const router = {
  name: 'vue-router',
  version: '^4.1.6',
  stableVersion: '4.1.6',
  env: 'pro'
}
const pinia = {
  name: ['pinia', 'pinia-plugin-persistedstate'],
  version: ['^2.0.33', '^3.1.0'],
  stableVersion: ['2.0.14', '^1.0.0'],
  env: 'pro'
}

const prettier = {
  name: 'prettier',
  version: '^2.8.4',
  stableVersion: '^2.8.0',
  env: 'dev'
}

const eslintVue = {
  name: 'eslint-plugin-vue',
  version: '^9.9.0',
  stableVersion: '^9.8.0',
  env: 'dev'
}

const eslintPlugin = {
  name: [
    'eslint',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser'
  ],
  version: ['^8.36.0', '^5.44.0', '^5.44.0'],
  stableVersion: ['^8.18.0', '^5.55.0', '^5.55.0'],
  env: ['dev', 'dev', 'dev']
}

const eslintWithPrettier = {
  name: ['eslint-config-prettier', 'eslint-plugin-prettier'],
  version: ['^8.7.0', '^4.2.1'],
  stableVersion: ['^8.5.0', '^4.2.1'],
  env: 'dev'
}

const elementPlugThemeEffect = {
  name: '@pureadmin/theme',
  version: '^2.0.0',
  stableVersion: '^2.0.0',
  env: 'pro'
}
const varletEffect = {
  name: '@varlet/touch-emulator',
  version: '^2.9.1',
  stableVersion: '^1.27.20',
  dev: 'pro'
}

const tinyVueEffect = {
  name: '@opentiny/vue-vite-import',
  version: '^1.0.0',
  stableVersion: '^1.0.0',
  dev: 'dev'
}

const sassEffect = {
  name: 'sass',
  version: '^1.59.3',
  stableVersion: '^1.53.0',
  env: 'dev'
}

const lessEffect = {
  name: 'less',
  version: '^4.1.3',
  stableVersion: '^4.1.3',
  env: 'dev'
}

const vuetifyEffect = {
  name: 'vite-plugin-vuetify',
  version: '^1.0.2',
  stableVersion: '^1.0.0-alpha.12',
  dev: 'dev'
}

const themeEffect = {
  name: ['@erkelost/colorpicker', '@relaxed/layout', '@relaxed/utils'],
  version: ['^1.0.8', '^2.0.17', '^2.0.17'],
  stableVersion: ['^1.0.8', '^2.0.17', '^2.0.17'],
  dev: 'pro'
}

const elementPlusProThemeEffect = {
  name: ['css-color-function', 'colord'],
  version: ['^1.3.3', '^2.9.2'],
  dev: ['pro', 'pro']
}
const constantDevDeps = {
  name: ['vite', 'typescript', 'vue-tsc'],
  version: ['^4.2.0', '^5.0.2', '^1.2.0'],
  stableVersion: ['^4.1.0', '^4.9.3', '^1.0.24'],
  dev: ['dev', 'dev', 'dev']
}
const constantProDeps = {
  name: ['@vueuse/core', '@vueuse/head', 'vue'],
  version: ['9.13.0', '1.1.23', '^3.2.47'],
  stableVersion: ['latest', 'latest', 'latest', '^3.2.45'],
  dev: ['pro', 'pro', 'dev', 'pro']
}
export {
  constantDevDeps,
  constantProDeps,
  eslintWithPrettier,
  elementPlusProThemeEffect,
  lessEffect,
  vuetifyEffect,
  sassEffect,
  varletEffect,
  themeEffect,
  elementPlugThemeEffect,
  eslintPlugin,
  eslintVue,
  prettier,
  pinia,
  router,
  tinyVueEffect
}
