<template>
  <a-divider title-placement="center">颜色主题</a-divider>
  <a-row :gutter="20">
    <a-col v-for="color in theme.themeColorList" :key="color" flex-x-center>
      <color-checkbox
        :color="color"
        :checked="color === theme.themeColor"
        @click="theme.setThemeColor(color)"
      />
    </a-col>
  </a-row>
  <a-divider title-placement="center">其他颜色</a-divider>
  <DColorPicker v-model="theme.themeColor" />
</template>
<script lang="ts" setup>
import { useThemeStore } from '@/store'
// import {
//   shadeBgColor,
//   writeNewStyle,
//   createNewStyle
// } from '../../theme-color/element-plus'
const body = document.documentElement as HTMLElement
const theme = useThemeStore()

// const setThemeColor = (color: string) => {
//   setEpThemeColor(color)
// }
// const setEpThemeColor = (color: string) => {
//   // @ts-expect-error
//   writeNewStyle(createNewStyle(color))
//   // useEpThemeStoreHook().setEpThemeColor(color)
//   body.style.setProperty('--el-color-primary-active', shadeBgColor(color))
// }
// watch(
//   () => theme.themeColor,
//   () => {
//     setEpThemeColor(theme.themeColor)
//   }
// )
</script>
