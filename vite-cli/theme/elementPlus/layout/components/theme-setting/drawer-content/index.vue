<template>
  <el-drawer
    :size="350"
    v-model="app.settingDrawerVisible"
    :with-header="false"
    :before-close="handleClose"
    :append-to-body="true"
    :show-close="false"
    :close-on-press-escape="true"
  >
    <div text-center>
      <!-- <GlobalLayout /> -->
      <GlobalTheme />
      <!-- <GlobalConfig /> -->
    </div>
    <GlobalCopy />
  </el-drawer>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store'

const app = useAppStore()
const handleClose = (done: () => void) => {
  done()
}
</script>
<style scoped lang="scss">
:deep(.el-overlay) {
  background-color: rgba(0, 0, 0, 0.1) !important;
}
</style>
