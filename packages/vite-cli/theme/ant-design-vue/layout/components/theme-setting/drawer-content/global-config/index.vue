<template>
  <div>
    <el-divider title-placement="center">界面功能</el-divider>
    <setting-menu label="菜单栏是否跟随系统主题">
      <el-switch
        v-model="theme.header.visible"
        active-text="开启"
        inline-prompt
        inactive-text="关闭"
      />
    </setting-menu>
    <setting-menu label="展示Header">
      <el-switch
        v-model="theme.header.visible"
        active-text="开启"
        inline-prompt
        inactive-text="关闭"
      />
    </setting-menu>
    <setting-menu label="展示Tab">
      <el-switch
        v-model="theme.tab.visible"
        active-text="开启"
        inline-prompt
        inactive-text="关闭"
      />
    </setting-menu>
    <setting-menu label="展示Sider">
      <el-switch
        v-model="theme.sider.visible"
        active-text="开启"
        inline-prompt
        inactive-text="关闭"
      />
    </setting-menu>
    <setting-menu label="展示Footer">
      <el-switch
        v-model="theme.footer.visible"
        active-text="开启"
        inline-prompt
        inactive-text="关闭"
      />
    </setting-menu>
    <setting-menu label="固定Sider">
      <el-switch
        v-model="theme.sider.fixedSider"
        active-text="开启"
        inline-prompt
        inactive-text="关闭"
      />
    </setting-menu>
    <setting-menu label="固定Footer">
      <el-switch
        v-model="theme.footer.fixed"
        active-text="开启"
        inline-prompt
        inactive-text="关闭"
      />
    </setting-menu>
    <setting-menu label="固定Header和Tab栏">
      <el-switch
        v-model="theme.fixedHeaderAndTab"
        active-text="开启"
        inline-prompt
        inactive-text="关闭"
      />
    </setting-menu>
    <setting-menu label="是否移动Tab栏布局">
      <el-switch
        v-model="theme.tab.tabMoveable"
        active-text="开启"
        inline-prompt
        inactive-text="关闭"
      />
    </setting-menu>
    <setting-menu label="Header高度">
      <el-input-number size="small" v-model="theme.header.height" />
    </setting-menu>
    <setting-menu label="Tab高度">
      <el-input-number size="small" v-model="theme.tab.height" />
    </setting-menu>
    <setting-menu label="Footer高度">
      <el-input-number size="small" v-model="theme.footer.height" />
    </setting-menu>
    <setting-menu label="Sider宽度">
      <el-input-number size="small" v-model="theme.sider.width" />
    </setting-menu>
    <setting-menu label="Sider折叠之后的宽度">
      <el-input-number size="small" v-model="theme.sider.collapsedWidth" />
    </setting-menu>
    <el-divider title-placement="center">界面展示</el-divider>
    <setting-menu label="面包屑">
      <el-switch
        v-model="theme.fixedHeaderAndTab"
        active-text="开启"
        inline-prompt
        inactive-text="关闭"
      />
    </setting-menu>
    <setting-menu label="面包屑图标">
      <el-switch
        v-model="theme.fixedHeaderAndTab"
        active-text="开启"
        inline-prompt
        inactive-text="关闭"
      />
    </setting-menu>
    <setting-menu label="页面切换动画">
      <el-switch
        v-model="theme.page.animate"
        active-text="开启"
        inline-prompt
        inactive-text="关闭"
      />
    </setting-menu>
    <setting-menu label="页面切换动画类型">
      <el-select v-model="theme.page.animateMode" placeholder="Select">
        <el-option
          v-for="item in theme.page.animateModeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </setting-menu>
    <setting-menu label="实时公司切换">
      <el-select v-model="theme.page.animateMode" placeholder="Select">
        <el-option
          v-for="item in theme.page.animateModeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </setting-menu>
  </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store'

const theme = useThemeStore()
</script>
<style scoped lang="less">
:deep(.el-switch__core) {
  transform: scale(1.2);
  width: 4rem !important;
}
:deep(.el-select) {
  width: 10rem !important;
}
:deep(.el-input--small .el-input__inner) {
  height: 30px;
  line-height: 30px;
}
</style>
