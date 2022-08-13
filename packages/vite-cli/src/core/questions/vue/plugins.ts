// 给select赋值是为了主题化 修改默认选中状态 不能写成动态是因为prompts的bug
export default {
  name: 'plugins',
  type: 'multiselect',
  message: 'Custorm Your Plugins',
  choices: [
    {
      title: '@vitejs/plugin-vue-jsx',
      value: 'jsx'
    },
    {
      title: '@vitejs/plugin-legacy',
      value: 'legacy'
    },
    {
      title: 'vite-plugin-html',
      value: 'html'
    },
    {
      title: 'unplugin-vue-components',
      value: 'vue-components',
      selected: false
    },
    {
      title: 'unplugin-auto-import',
      value: 'auto-import',
      selected: false
    },
    {
      title: 'unplugin-icons',
      value: 'icons',
      selected: false
    },
    {
      title: 'Unocss',
      value: 'unocss',
      selected: false
    },
    { title: 'vite-plugin-pwa', value: 'pwa' },
    {
      title: 'vite-plugin-inspect',
      value: 'inspect'
    },
    {
      title: 'rollup-plugin-visualizer',
      value: 'visualizer'
    }
  ],
  hint: '- Space to select. Return to submit',
  instructions: false
}
