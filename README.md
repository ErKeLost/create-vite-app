# ViteCLI

<p align="center">
  <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
      <img width="220" src="https://jzzx-docs.netlify.app/assets/CLI.29e4809b.png" alt="Vite logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/vite"><img src="https://img.shields.io/npm/v/vite.svg" alt="npm package"></a>
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatibility"></a>
  <a href="https://github.com/vitejs/vite/actions/workflows/ci.yml"><img src="https://github.com/vitejs/vite/actions/workflows/ci.yml/badge.svg?branch=main" alt="build status"></a>
  <a href="https://chat.vitejs.dev"><img src="https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord" alt="discord chat"></a>
  <a href="https://chat.vitejs.dev"><img src="https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord" alt="discord chat"></a>
  <a href="https://chat.vitejs.dev"><img src="https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord" alt="discord chat"></a>
</p>
<br/>

# 🚧🚧 Build highly customized scaffold out of the box based on vite3

- Recommended to use pnpm to install ViteCLI .

```ts
  pnpm add vite-create-app@latest -g
```

- Enter 'vite' on the command line to check whether the installation is successful

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee03e671a0164f38b7617680f66b3475~tplv-k3u1fbpfcp-watermark.image?)

- Enter 'vite create'project name' ` vite create plus your project name

```ts
 vite create template
```

- Step1 Select the package manager that needs to be created. It is recommended to use pnpm to create projects

```js
🎨  🎨   VITE_CLI V-0.0.9-alpha   🎨  🎨

🚀 Welcome To Create Template for Vite!

? 选择您的包管理器 (Use arrow keys)
> Pnpm
  Yarn
  Npm
```

- Step2 Select the dependency to add the project

```ts
√ Add Vue Router for Single Page Application development? ... No / Yes
√ Add Pinia for state management? ... No / Yes
√ Add ESLint for code quality? ... No / Yes
√ Add Prettier for code formatting? ... No / Yes
? 选择 UI 框架 (Use arrow keys)
> Vuetify3 Beta
  Element Plus
  Ant Design Vue 2.x
  Naive UI
  Vant 3.x
```

- Step3 Select custom import vite plugin

```ts
? Custorm Plugins (自定义你的插件) (Press <space> to select, <a> to toggle all, <i> to invert selection)
 ( ) rollup-plugin-visualizer 打包后包体积分析
 ( ) unplugin-icons 按需加载图标库
 ( ) @vitejs/plugin-vue-jsx 提供 Vue 3 JSX 支持
>( ) @vitejs/plugin-legacy 为打包后的文件提供传统浏览器兼容性支持
 ( ) unplugin-vue-components 自动按需导入Vue组件
 ( ) AutoImport 自动引入Api
 ( ) Unocss 即时的按需原子 CSS 引擎
```

Currently, the template supports the following plugins
The supported template presets are:

| FrameWork     | finish |
| ------------- | ------ |
| Vite3 Vue3    | 🚧✅   |
| Vite3 React18 | 🚧❌   |
| Nuxt          | 🚧❌   |

| Feature / Version | finish | UI Library     | finish |
| ----------------- | ------ | -------------- | ------ |
| Vue-Router 4.x    | ✅     | Element-Plus   | ✅     |
| Pinia 2.x         | ✅     | Naive-UI       | ✅     |
| Eslint 8.x        | ✅     | DevUI          | 🚧❌   |
| Prettier 2.7.x    | ✅     | Ant-design-vue | ✅     |
| TypeScript 4.7.x  | ✅     | Varlet         | 🚧❌   |
| husky             | 🚧❌   | Vant           | 🚧❌   |

| Feature / Version        | finish |
| ------------------------ | ------ |
| Vue                      | v3.2.x |
| Vite                     | v3.0.0 |
| @vitejs/plugin-vue-jsx   | ✅     |
| @vitejs/plugin-legacy    | ✅     |
| vite-plugin-inspect      | ✅     |
| vite-plugin-pwa          | ✅     |
| unplugin-vue-components  | ✅     |
| unplugin-auto-import     | ✅     |
| Unocss                   | ✅     |
| rollup-plugin-visualizer | ✅     |
| unplugin-icons           | ✅     |

### An example of executing dev after successful installation is as follows

- Naive UI

![556f861a3f20322adca15fd31855381.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e656b15c3ee74784acf302e745b95942~tplv-k3u1fbpfcp-watermark.image?)

- Ant Design

![e917270fc8fc23a3aa17b2fa831d564.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a34ca43f8d8543fab29ba38039d2d29d~tplv-k3u1fbpfcp-watermark.image?)

- Element Plus

![c74c77d05a9008e88dee87640ce06e3.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be5b047d16024f8fa1251798a46de28a~tplv-k3u1fbpfcp-watermark.image?)
