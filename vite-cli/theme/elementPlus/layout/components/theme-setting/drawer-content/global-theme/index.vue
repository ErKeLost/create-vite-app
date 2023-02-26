<template>
  <el-divider title-placement="center">颜色主题</el-divider>
  <el-row :gutter="35">
    <el-col
      :span="4"
      v-for="color in theme.themeColorList"
      :key="color"
      class="flex-x-center"
    >
      <color-checkbox
        :color="color"
        :checked="color === theme.themeColor"
        @click="theme.setThemeColor(color)"
      />
    </el-col>
  </el-row>
  <el-divider title-placement="center">其他颜色</el-divider>
  <DColorPicker v-model="theme.themeColor" />
</template>
<script lang="ts" setup>
import { useThemeStore } from '@/store'
import {
  shadeBgColor,
  writeNewStyle,
  createNewStyle
} from '../../theme-color/element-plus'
const body = document.documentElement as HTMLElement
const theme = useThemeStore()

// const setThemeColor = (color: string) => {
//   setEpThemeColor(color)
// }
const setEpThemeColor = (color: string) => {
  // @ts-expect-error
  writeNewStyle(createNewStyle(color))
  // useEpThemeStoreHook().setEpThemeColor(color)
  body.style.setProperty('--el-color-primary-active', shadeBgColor(color))
}
watch(
  () => theme.themeColor,
  () => {
    setEpThemeColor(theme.themeColor)
  }
)
</script>
