<p align="center">
  <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
      <img width="220" src="https://jzzx-docs.netlify.app/assets/vite.4d21301c.png" alt="Vite logo">
  </a>
</p>
<br/>
<p align="center">

[![OSCS Status](https://www.oscs1024.com/platform/badge/ErKeLost/vite-cli.svg?size=small)](https://www.oscs1024.com/project/ErKeLost/vite-cli?ref=badge_small)
<a href="https://npmjs.com/package/vite"><img src="https://img.shields.io/npm/v/vite.svg" alt="npm package"></a>
<a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatibility"></a>
<a href="https://github.com/vitejs/vite/actions/workflows/ci.yml"><img src="https://github.com/vitejs/vite/actions/workflows/ci.yml/badge.svg?branch=main" alt="build status"></a>
<a href="https://chat.vitejs.dev"><img src="https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord" alt="discord chat"></a>
<a href="https://chat.vitejs.dev"><img src="https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord" alt="discord chat"></a>
<a href="https://chat.vitejs.dev"><img src="https://img.shields.io/badge/chat-discord-blue?style=flat&logo=discord" alt="discord chat"></a>

</p>
<br/>

# Create Vite App

## ( Rapid iteration of the version ) 🚧🚧

## 📖 Introduction

Create Vite App resolve Vite create starter template No need to configure Vite scaffolding templates quickly build vite3 development templates highly customized

## 🌈 Features

- ⚛️ Support for multiple framework templates

- 📦 Select the out-of-the-box package manager

- 🚀 Various characteristics of the corresponding framework

- ✨ Selection of various Ui frameworks, Theming and layout

- 🍰 A variety of out-of-the-box Vite plugin options

## 📦 Installation

```ts
  npx vite-create-app@latest
```

## 🦄 Usage


![create-vite-app.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/930462095a9e46978d4b7258f9411b20~tplv-k3u1fbpfcp-watermark.image?)

- Step1 Select the package manager that needs to be created. It is recommended to use pnpm to create projects

```js
🎨  🎨   VITE_CLI V-0.0.9-alpha   🎨  🎨

🚀 Welcome To Create Template for Vite!

? 选择您的包管理器 (Use arrow keys)
> Pnpm (pnpm not install)
  Yarn (yarn not install)
  Npm
```

- Step2 Select the dependency to add the project

```ts
√ Add Vue Router for Single Page Application development? ... No / Yes
√ Add Pinia for state management? ... No / Yes
√ Add ESLint for code quality? ... No / Yes
√ Add Prettier for code formatting? ... No / Yes
? choose Your Device (选择目标设备) » - Use arrow-keys. Return to submit.
>   PC
    移动端
? choose UI frameWork (选择您的 UI 框架) » - Use arrow-keys. Return to submit.
>   Element Plus
    Vuetify3 Beta
    Naive UI
    Ant Design Vue 2.x
    DevUI
    arco-design
    TDesign
    Varlet
    Vant 3.x
    tdesign-mobile-vue
```

- Step3 Select custom import vite plugin

```ts
? Custorm Plugins (自定义你的插件) (Press <space> to select, <a> to toggle all, <i> to invert selection)
( )   @vitejs/plugin-vue-jsx 提供 Vue 3 JSX 支持
( )   @vitejs/plugin-legacy 为打包后的文件提供传统浏览器兼容性支持
( )   vite-plugin-html 构建您的index.html
( )   unplugin-vue-components 自动按需导入Vue组件
( )   unplugin-auto-import 自动引入Api
( )   Unocss 即时的按需原子 CSS 引擎
( )   vite-plugin-pwa 零配置 PWA
( )   vite-plugin-inspect 模块运行时依赖可视化
( )   rollup-plugin-visualizer 打包后包体积分析
( )   unplugin-icons 按需加载图标库
```

## 🤖 Feature Comparison

Currently, the template supports the following plugins
The supported template presets are:

### FrameWork

| FrameWork     | finish   |
| ------------- | -------- |
| Vite3 Vue3    | 🚧 ✅ 🆕 |
| Vite3 React18 | 🚧 ❌ 🆕 |
| Nuxt          | 🚧 ❌    |

### Feature

| Feature / Version | finish |
| ----------------- | ------ |
| Vue-Router 4.x    | ✅     |
| Pinia 2.x         | ✅     |
|                   |        |
| Eslint 8.x        | ✅     |
| Prettier 2.7.x    | ✅     |
| TypeScript 4.7.x  | ✅     |
| husky             | 🚧 ❌  |
| PWA               | 🚧 ❌  |
|                   |        |
|                   |        |

### UI Library

| UI Library         | finish |
| ------------------ | ------ |
| Element-Plus       | ✅ 🆕  |
| Naive-UI           | ✅ 🆕  |
| Vuetify-beta5      | ✅ 🆕  |
| DevUI              | ✅ 🆕  |
| Ant-design-vue     | ✅ 🆕  |
| arco-design        | ✅ 🆕  |
| TDesign            | ✅     |
| Varlet             | ✅     |
| tdesign-mobile-vue | 🚧 ❌  |
| Vant               | 🚧 ❌  |

### Plugins

| Feature / Version        | finish    |
| ------------------------ | --------- |
| Vue                      | v3.2.x    |
| Vite                     | v3.0.0 🆕 |
| @vitejs/plugin-vue-jsx   | ✅        |
| @vitejs/plugin-legacy    | ✅        |
| vite-plugin-inspect      | ✅        |
| vite-plugin-pwa          | ✅        |
| unplugin-vue-components  | ✅        |
| unplugin-auto-import     | ✅        |
| Unocss                   | ✅        |
| rollup-plugin-visualizer | ✅        |
| unplugin-icons           | ✅        |
| Vite-plugin-html         | ✅ 🆕     |

## 🛫 Example With theming

- [Element-Plus](https://create-vite-app-naive-ui.netlify.app/)

- [Naive-UI](https://create-vite-app-element-plus.netlify.app/)

- [Ant-Design-Vue](https://vite-cli-ant-design-vue.netlify.app/)

### An example of executing dev after successful installation is as follows

- Naive UI

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84463b72894c4df2862c20d006ab240c~tplv-k3u1fbpfcp-watermark.image?)

- Ant Design

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21469c6f20bd46ab8fb5df23376cfcba~tplv-k3u1fbpfcp-watermark.image?)

- Element Plus

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/682e343e8f924dbbb691811184e8428f~tplv-k3u1fbpfcp-watermark.image?)

- Arco Design

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b27ce1dd7d344170b59be4f2ccd39211~tplv-k3u1fbpfcp-watermark.image?)

- DevUI

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d0ed5a6340c4a62b35f72ac7b490077~tplv-k3u1fbpfcp-watermark.image?)

- T-Design

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa8e5b68f8b9481fac9cf4809ac50fbe~tplv-k3u1fbpfcp-watermark.image?)

- Vuetify

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5ea5124b6284c68b8b9948c9fdf803b~tplv-k3u1fbpfcp-watermark.image?)

- Varlet

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8f31a99cab645d4a5fb5cf0c4000ef6~tplv-k3u1fbpfcp-watermark.image?)

🌸 Credits

### This project is inspired by [X-Build](https://github.com/code-device/x-build) !!!
