<template>
  <a-button
    type="primary"
    fixed
    top-240px
    right-14px
    z-10000
    w-42px
    h-44px
    transition-all
    @click="app.toggleSettingDrawerVisible"
    :class="[{ '!right-350px': app.settingDrawerVisible }]"
  >
    <template #icon>
      <div m-2>
        <CarbonClose v-if="app.settingDrawerVisible" text-2xl />
        <CarbonSettings v-else text-2xl />
      </div>
    </template>
  </a-button>
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
