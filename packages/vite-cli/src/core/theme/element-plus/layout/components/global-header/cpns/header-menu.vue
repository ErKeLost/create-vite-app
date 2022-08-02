<template>
  <div h-full>
    <el-menu mode="horizontal" :ellipsis="false" :default-active="route.path">
      <template v-for="item in routes" :key="item.path">
        <template v-if="item.meta.type === 2">
          <el-sub-menu :index="item.path">
            <template #title>
              <span>{{ item.meta.title }}</span>
            </template>
            <template v-for="subItem in item.children" :key="subItem.path">
              <el-menu-item :index="subItem.path" @click="path(subItem)">
                <span>{{ subItem.meta?.title }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <!-- 一级菜单 -->
        <template v-else-if="item.meta.type === 1">
          <el-menu-item :index="item.path" @click="path(item)">
            <span>{{ item.meta.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store'
import { routes } from '@/router/modules'
const router = useRouter()

const route = useRoute()
const app = useAppStore()
function path(item) {
  router.push({
    path: item.path ?? '/not-found'
  })
}
</script>
<style scoped>
.el-menu {
  border-right: none;
}
</style>
