<template>
  <div :class="{ 'container-content': true }">
    <router-view v-slot="{ Component, route }">
      <transition
        :name="theme.page.animate ? theme.page.animateMode : undefined"
        mode="out-in"
        appear
      >
        <!-- <keep-alive :include="routeStore.cacheRoutes">
          <component :is="Component" v-if="app.reloadFlag" :key="route.path" />
        </keep-alive> -->
        <component :is="Component" v-if="app.reloadFlag" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useAppStore, useThemeStore } from '@/store'
interface Props {
  /** 显示padding */
  showPadding?: boolean
}
withDefaults(defineProps<Props>(), {
  showPadding: true
})
const app = useAppStore()
const theme = useThemeStore()
const containerPadding = ref<number | string>(25)
const containerPaddingRef = computed(() => {
  return containerPadding + 'px'
})
const containerHeight = computed(() => {
  const headerHeight = theme.header.visible ? theme.header.height : 0
  const tabHeight = theme.tab.visible ? theme.tab.height : 0
  const footerHeight = theme.footer.visible ? theme.footer.height : 0
  return headerHeight + tabHeight + footerHeight + 50 + 'px'
})
</script>
<style scoped>
.container-content {
  box-sizing: content-box;
  background: #f5f6f9;
  padding: 25px;
}
</style>
