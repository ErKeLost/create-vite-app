<template>
  <div class="text-xl sub-title" flex items-center>
    <img mr-3 :src="yinhe" alt="" />
    <div font-bold>中国银河证券</div>
    <el-divider direction="vertical" />
    <div class="letter sub-title">合规风控系统</div>
  </div>
</template>

<script setup lang="ts">
import yinhe from '@/assets/yinhe/yinhe.png'
const subTitleColor = ref('#3A3F63')
</script>

<style scoped lang="less">
.sub-title {
  color: v-bind(subTitleColor);
}
.letter {
  font-weight: 530;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
}
:deep(.el-divider--vertical) {
  margin: 0 10px;
  background-color: v-bind(subTitleColor);
  border-left: v-bind(subTitleColor);
}
</style>
