// 给select赋值是为了主题化 修改默认选中状态 不能写成动态是因为prompts的bug
export default {
  name: 'plugins',
  type: 'multiselect',
  message: 'Custorm Your Plugins (自定义您的插件)',
  choices: [
    {
      title: '@vitejs/plugin-vue-jsx 提供 Vue 3 JSX 支持',
      value: 'jsx'
    },
    {
      title: '@vitejs/plugin-legacy 为打包后的文件提供传统浏览器兼容性支持',
      value: 'legacy'
    },
    {
      title: 'vite-plugin-html 构建您的index.html',
      value: 'html'
    },
    {
      title: 'unplugin-vue-components 自动按需导入Vue组件',
      value: 'vue-components',
      selected: false
    },
    {
      title: 'unplugin-auto-import 自动引入Api',
      value: 'auto-import',
      selected: false
    },
    {
      title: 'unplugin-icons 按需加载图标库',
      value: 'icons',
      selected: false
    },
    {
      title: 'Unocss 即时的按需原子 CSS 引擎',
      value: 'unocss',
      selected: false
    },
    { title: 'vite-plugin-pwa 零配置 PWA', value: 'pwa' },
    {
      title: 'vite-plugin-inspect 模块运行时依赖可视化',
      value: 'inspect'
    },
    {
      title: 'rollup-plugin-visualizer 打包后包体积分析',
      value: 'visualizer'
    }
  ],
  hint: '- Space to select. Return to submit',
  instructions: false
}
