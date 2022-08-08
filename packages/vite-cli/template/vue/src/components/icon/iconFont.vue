<template>
  <el-tooltip effect="light" :content="content" placement="bottom">
    <div flex cursor-pointer class="iconfontHover">
      <i @click="clickIcon" class="iconfont" :class="icon"></i>
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store'
defineProps<{
  icon?: string
  content?: string
}>()
const emit = defineEmits<{
  (e: 'click'): void
}>()
const currentColor = computed(() => useThemeStore().themeColor)
function clickIcon() {
  emit('click')
}
</script>

<style scoped lang="scss">
.iconfontHover {
  font-size: 1.5rem;
  padding: 0 0.5rem;
  color: v-bind(currentColor);
}
.iconfont {
  font-size: 1.3rem;
}
</style>
