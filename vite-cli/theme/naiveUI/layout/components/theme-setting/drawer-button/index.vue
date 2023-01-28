<template>
  <n-button
    type="primary"
    fixed
    top-240px
    right-14px
    z-10000
    p-0
    w-42px
    h-42px
    transition-all
    @click="app.toggleSettingDrawerVisible"
    :class="[{ '!right-350px': app.settingDrawerVisible }]"
  >
    <CarbonClose v-if="app.settingDrawerVisible" text-2xl />
    <CarbonSettings v-else text-2xl />
  </n-button>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store'

const app = useAppStore()
</script>
<style scoped>
.el-button {
  height: 42px !important;
}

.size {
  font-size: 1.5rem;
  line-height: 2rem;
}
</style>
