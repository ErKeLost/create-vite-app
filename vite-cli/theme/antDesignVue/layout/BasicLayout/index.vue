<template>
  <adny-layout
    :mode="mode"
    :min-width="theme.layout.minWidth"
    :fixed-header-and-tab="theme.fixedHeaderAndTab"
    :header-height="theme.header.height"
    :header-visible="theme.header.visible"
    :tab-visible="theme.tab.visible"
    :tab-height="theme.tab.height"
    :footer-height="theme.footer.height"
    :footer-visible="theme.footer.visible"
    :sider-visible="theme.sider.visible"
    :sider-width="siderWidth"
    :sider-collapsed-width="theme.sider.collapsedWidth"
    :sider-collapse="app.siderCollapse"
    :fixed-footer="theme.footer.fixed"
    :fixed-sider="theme.sider.fixedSider"
    :tab-moveable="theme.tab.tabMoveable"
  >
    <template #header>
      <GlobalHeader :style="{ background: theme.header.bgColor }" />
    </template>
    <template #tab>
      <GlobalTab
        flex
        items-center
        pl-25px
        pr-25px
        :style="{ background: theme.tab.bgColor }"
      />
    </template>
    <template #sider>
      <GlobalSider />
    </template>
    <template #footer>
      <GlobalFooter />
    </template>
    <GlobalContent />
  </adny-layout>
  <ThemeSetting v-if="VITE_ENV === 'development'" />
  <!-- <ThemeSetting v-if="false" /> -->
</template>

<script setup lang="ts">
import { useAppStore, useThemeStore } from '@/store'
import { useBasicLayout } from '@/composables'
const { VITE_ENV } = import.meta.env
const app = useAppStore()
const theme = useThemeStore()

const { mode, siderWidth } = useBasicLayout()
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
