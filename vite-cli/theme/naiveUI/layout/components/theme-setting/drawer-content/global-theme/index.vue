<template>
  <n-divider title-placement="center">颜色主题</n-divider>
  <n-grid :cols="8" :x-gap="8" :y-gap="12">
    <n-grid-item
      v-for="color in theme.themeColorList"
      :key="color"
      flex-x-center
    >
      <color-checkbox
        :color="color"
        :checked="color === theme.themeColor"
        @click="theme.setThemeColor(color)"
      />
    </n-grid-item>
  </n-grid>
  <n-divider title-placement="center">其他颜色</n-divider>
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
