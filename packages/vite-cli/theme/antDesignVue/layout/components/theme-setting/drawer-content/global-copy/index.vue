<template>
  <el-divider title-placement="center">封装全局配置</el-divider>
  <el-alert type="warning" :closable="false">
    <div class="setting">
      该功能主要实时预览各种布局效果，更多完整配置在 projectSetting.ts
      中设置，生产环境默认关闭该布局预览功能。
    </div>
  </el-alert>
  <div mt w-auto flex flex-col flex-gap-6>
    <el-button type="primary">重置当前配置</el-button>
    <el-button>拷贝当前配置</el-button>
  </div>
</template>
<script lang="ts" setup></script>
<style scoped lang="less">
.setting {
  font-size: 1rem;
  padding: 0.3rem 0;
  letter-spacing: 0.2rem;
}
:deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>
