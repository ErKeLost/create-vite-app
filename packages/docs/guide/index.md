# Getting Started

## Overview

Vite-CLI 帮助你快速搭建开箱即用模板 目前 alpha 版本 基于 Vite + Vue3 + Typescript 构建模板， 对模板进行不同程度优化，打造具备基础功能可自定义模板， 自由搭建开发项目

## 快速开始

- 推荐使用 Pnpm 安装 Vite-CLI .

```ts
  pnpm add vite-create-app@latest -g
```

- 命令行输入 `vite` 查看是否安装成功

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee03e671a0164f38b7617680f66b3475~tplv-k3u1fbpfcp-watermark.image?)

- 输入 `vite create 'project name'` vite create 加上您的项目名称

```ts
 vite create template
```

- Step1 选择需要创建的包管理器

```js
🎨  🎨   VITE_CLI V-0.0.9-alpha   🎨  🎨

🚀 Welcome To Create Template for Vite!

? 选择您的包管理器 (Use arrow keys)
> Pnpm
  Yarn
  Npm
```

:::tip
推荐使用 Pnpm 创建项目
:::

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

:::tip
目前 0.1.0-alpha 版本组件库 可以使用 Element-plus, Ant-Design-vue, Naive-UI, Vuetify 目前还处于 Beta
:::

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
