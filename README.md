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

- 推荐使用 Pnpm 安装 Vite-CLI .

```ts
  pnpm add vite-create-app -g
```

- 命令行输入 `vite` 查看是否安装成功

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee03e671a0164f38b7617680f66b3475~tplv-k3u1fbpfcp-watermark.image?)

- 输入 `vite create 'project name'` vite create 加上您的项目名称

```ts
 vite create template
```

- Step1 选择需要创建的包管理器 ，推荐使用 Pnpm 创建项目

```js
🎨  🎨   VITE_CLI V-0.0.9-alpha   🎨  🎨

🚀 Welcome To Create Template for Vite!

? 选择您的包管理器 (Use arrow keys)
> Pnpm
  Yarn
  Npm
```

- Step2 选择 需要 添加项目的依赖

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

> 目前 0.1.0-alpha 版本组件库 可以使用 Element-plus, Ant-Design-vue, Naive-UI, Vuetify 目前还处于 **Beta 状态**

- Step3 选择自定义引入 Vite 插件

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

目前模板支持插件如下，
The supported template presets are:

|        presets 包        |               vite 插件                |
| :----------------------: | :------------------------------------: |
|  @vitejs/plugin-vue-jsx  |          提供 Vue 3 JSX 支持           |
|  @vitejs/plugin-legacy   | 为打包后的文件提供传统浏览器兼容性支持 |
|   vite-plugin-inspect    |          模块运行时依赖可视化          |
|     vite-plugin-pwa      |               零配置 PWA               |
| unplugin-vue-components  |         自动按需导入 Vue 组件          |
|   unplugin-auto-import   |            自动按需引入 Api            |
|          Unocss          |        即时的按需原子 CSS 引擎         |
| rollup-plugin-visualizer |            打包后包体积分析            |
|      unplugin-icons      |             按需加载图标库             |

### 安装成功后 执行 dev 举例如下

- Naive UI

![556f861a3f20322adca15fd31855381.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e656b15c3ee74784acf302e745b95942~tplv-k3u1fbpfcp-watermark.image?)

- Ant Design

![e917270fc8fc23a3aa17b2fa831d564.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a34ca43f8d8543fab29ba38039d2d29d~tplv-k3u1fbpfcp-watermark.image?)

- Element Plus

![c74c77d05a9008e88dee87640ce06e3.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be5b047d16024f8fa1251798a46de28a~tplv-k3u1fbpfcp-watermark.image?)

> 后期支持如下

- 1. 是否使用 Typescript
- 2. 支持 Vue2.7
- 3. 支持 React
- 4. 支持 Nuxt 模板
- 5. 支持更多组件库， 插件自定义搭建
- 6. 主题化 布局化 根据不同组件库 动态搭建不同主题配置， 布局配置
- 7. eslint， prettier， husky， commitlint
