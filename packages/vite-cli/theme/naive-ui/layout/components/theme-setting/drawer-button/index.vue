<template>
  <el-button
    type="primary"
    fixed
    top-240px
    right-14px
    z-10000
    w-42px
    p-0
    transition-all
    @click="app.toggleSettingDrawerVisible"
    :class="[{ '!right-350px': app.settingDrawerVisible }]"
  >
    <CarbonClose v-if="app.settingDrawerVisible" text-2xl />
    <el-icon v-else class="size is-loading">
      <CarbonSettings />
    </el-icon>
  </el-button>
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
