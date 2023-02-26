<template>
  <div h-full>
    <div @click="app.setSiderCollapse(!app.siderCollapse)">
      <TabBurger
        :is-active="app.siderCollapse"
        class="hamburger-container"
        @toggleClick="changehambuger"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store'
const app = useAppStore()
function changehambuger() {
}
</script>
<style scoped></style>
