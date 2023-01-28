<template>
  <div pl-6 pr-6 flex items-center justify-between class="h-full">
    <HeaderCompany />
    <div flex items-center>
      <HeaderMenu />
      <el-dropdown trigger="click">
        <div flex items-center class="el-dropdown-link">
          <el-avatar
            :size="35"
            v-if="userInfo?.avatar"
            :src="userInfo.avatar"
            :style="{ 'margin-right': '10px' }"
          />
          <p v-if="userInfo?.realName">
            {{ userInfo.realName }}
          </p>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="router.push({ path: '/login' })">
              <div class="i-carbon-logout" mr-2 />
              退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from '@/store'
const { userInfo } = storeToRefs(useUserStore())
const router = useRouter()
</script>
<style scoped lang="less"></style>
