const router = {
  name: 'vue-router',
  version: '^4.1.1',
  stableVersion: '4.1.1'
}
const pinia = {
  name: 'pinia',
  version: '^2.0.14',
  stableVersion: '2.0.14'
}

const piniaPluginPersist = {
  name: 'pinia-plugin-persist',
  version: '^1.0.0',
  stableVersion: '^1.0.0'
}

const prettier = {
  name: 'prettier',
  version: '^2.7.1',
  stableVersion: '^2.7.1'
}

const eslintVue = {
  name: 'eslint-plugin-vue',
  version: '^9.1.1',
  stableVersion: '^9.1.1'
}

const eslintPlugin = [
  {
    eslint: '^8.18.0'
  },
  {
    '@typescript-eslint/eslint-plugin': '^5.30.5'
  },
  {
    '@typescript-eslint/parser': '^5.30.5'
  }
]

const eslintWithPrettier = [
  {
    'eslint-config-prettier': '^8.5.0'
  },
  {
    'eslint-plugin-prettier': '^4.2.1'
  }
]

export {
  eslintWithPrettier,
  eslintPlugin,
  eslintVue,
  prettier,
  piniaPluginPersist,
  pinia,
  router
}
