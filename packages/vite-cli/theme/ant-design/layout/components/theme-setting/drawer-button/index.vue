<template>
  <div fixed top-240px right-14px z-10000 transition-all>
    <a-button
      w-100vh
      type="primary"
      @click="app.toggleSettingDrawerVisible"
      :class="[{ '!right-350px': app.settingDrawerVisible }]"
    >
      <template #icon>
        <div mt-1>
          <CarbonClose v-if="app.settingDrawerVisible" text-2xl />
          <CarbonSettings v-else text-2xl />
        </div>
      </template>
    </a-button>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store'

const app = useAppStore()
</script>
<style scoped lang="less">
.ant-btn-icon-only {
  width: 40px;
  height: 40px;
}
.el-button {
  height: 42px !important;
}

.size {
  font-size: 1.5rem;
  line-height: 2rem;
}
</style>
