export default {
  name: 'plugins',
  type: 'checkbox',
  message: 'Custorm Your Plugins (自定义您的插件)',
  choices: [
    { name: '@vitejs/plugin-vue-jsx 提供 Vue 3 JSX 支持', value: 'jsx' },
    {
      name: '@vitejs/plugin-legacy 为打包后的文件提供传统浏览器兼容性支持',
      value: 'legacy'
    },
    {
      name: 'unplugin-vue-components 自动按需导入Vue组件',
      value: 'vue-components'
    },
    { name: 'unplugin-auto-import 自动引入Api', value: 'auto-import' },
    { name: 'Unocss 即时的按需原子 CSS 引擎', value: 'unocss' },
    { name: 'vite-plugin-pwa 零配置 PWA', value: 'pwa' },
    {
      name: 'vite-plugin-inspect 模块运行时依赖可视化',
      value: 'inspect'
    },
    {
      name: 'rollup-plugin-visualizer 打包后包体积分析',
      value: 'visualizer'
    },
    { name: 'unplugin-icons 按需加载图标库', value: 'icons' }
  ]
}
