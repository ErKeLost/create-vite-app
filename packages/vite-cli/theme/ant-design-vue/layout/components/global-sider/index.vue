<template>
  <div overflow-x-hidden h-full flex justify-center class="siderbar-container">
    <el-menu
      mode="vertical"
      :collapse-transition="false"
      :default-active="route.path"
      :collapse="app.siderCollapse"
      active-text-color="#fff"
      :text-color="textColor"
      :background-color="menuBackground"
    >
      <template v-for="item in routes" :key="item.path">
        <template v-if="item.meta.type === 2">
          <el-sub-menu
            :style="
              app.siderCollapse
                ? {
                    display: 'flex',
                    'justify-content': 'center',
                    'align-items': 'center'
                  }
                : null
            "
            :index="item.path"
          >
            <template #title>
              <SvgIcon
                class="sub-menu-icon"
                width="1.5rem"
                :color="textColor"
                :style="app.siderCollapse ? '' : { 'margin-right': '1.25rem' }"
                :icon="item.meta.icon"
              />
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
          <el-menu-item
            :style="
              app.siderCollapse
                ? {
                    display: 'flex',
                    'justify-content': 'center',
                    'align-items': 'center',
                    margin: '0px 10px'
                  }
                : null
            "
            :index="item.path"
            @click="path(item)"
          >
            <SvgIcon
              width="1.5rem"
              :color="textColor"
              :style="app.siderCollapse ? null : { 'margin-right': '1.25rem' }"
              :icon="item.meta.icon"
            />
            <span>{{ item.meta.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script setup lang="ts">
import { Icon as Iconify } from '@iconify/vue'
import { useAppStore, useThemeStore } from '@/store'
import { routes } from '@/router/modules'
import SvgIcon from '../../../components/icon/svgIcon.vue'

const router = useRouter()
const route = useRoute()
const app = useAppStore()
const theme = useThemeStore()
const menuBackground = computed(() =>
  theme.menuConfig.menuColorState
    ? theme.menuConfig.darkMenuColor
    : theme.menuConfig.lightMenuColor
)
const textColor = computed(() =>
  theme.menuConfig.menuColorState ? '#b2c0e7' : '#000'
)
function path(item) {
  router.push({
    path: item.path ?? '/not-found'
  })
}
</script>
<style scoped lang="less">
.el-menu {
  border-right: none;
  width: 210px;
}
.siderbar-container {
  background: v-bind(menuBackground);
}
:deep(.el-menu-item.is-active) {
  background-color: var(--el-color-primary-light-1) !important;
  border-radius: 6px;
}
:deep(.el-sub-menu .el-menu-item) {
  height: 45px;
  margin: 8px 0;
}
.el-menu-item {
  border-radius: 6px;
}
:deep(.el-menu-item) {
  height: 45px;
  margin: 5.5px 0;
}
:deep(.el-menu-item:hover) {
  background-color: var(--el-color-primary-light-7) !important;
}
</style>
