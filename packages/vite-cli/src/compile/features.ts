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

export { eslintWithPrettier, eslintPlugin, eslintVue, prettier, pinia, router }
