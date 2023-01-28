const router = {
  name: 'vue-router',
  version: '^4.1.6',
  stableVersion: '4.1.6'
}
const pinia = {
  name: ['pinia', 'pinia-plugin-persist'],
  version: ['^2.0.27', '^1.0.0'],
  stableVersion: ['2.0.14', '^1.0.0']
}

const prettier = {
  name: 'prettier',
  version: '^2.8.0',
  stableVersion: '^2.8.0'
}

const eslintVue = {
  name: 'eslint-plugin-vue',
  version: '^9.8.0',
  stableVersion: '^9.8.0'
}

const eslintPlugin = {
  name: [
    'eslint',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser'
  ],
  version: ['^8.28.0', '^5.44.0', '^5.44.0'],
  stableVersion: ['^8.18.0', '^5.30.5', '^5.30.5']
}

const eslintWithPrettier = {
  name: ['eslint-config-prettier', 'eslint-plugin-prettier'],
  version: ['^8.5.0', '^4.2.1'],
  stableVersion: ['^8.5.0', '^4.2.1']
}

const elementPlugThemeEffect = {
  name: '@pureadmin/theme',
  version: '^2.0.0',
  stableVersion: '^2.0.0'
}
const varletEffect = {
  name: '@varlet/touch-emulator',
  version: '^1.27.20',
  stableVersion: '^1.27.20'
}

const sassEffect = {
  name: 'sass',
  version: '^1.53.0',
  stableVersion: '^1.53.0'
}

const lessEffect = {
  name: 'less',
  version: '^4.1.3',
  stableVersion: '^4.1.3'
}

const vuetifyEffect = {
  name: 'vite-plugin-vuetify',
  version: '^1.0.0-alpha.12',
  stableVersion: '^1.0.0-alpha.12'
}

const themeEffect = {
  name: ['@erkelost/colorpicker', '@relaxed/layout', '@relaxed/utils'],
  version: ['^1.0.8', '^2.0.5', '^2.0.5'],
  stableVersion: ['^1.0.8', '^2.0.5', '^2.0.5']
}
const elementPlusProThemeEffect = {
  name: ['css-color-function', 'colord'],
  version: ['^1.3.3', '^2.9.2']
}

export {
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
  router
}
