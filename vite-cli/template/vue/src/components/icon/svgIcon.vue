<template>
  <div
    flex-center
    @mouseenter="mouseColor = currentColor"
    @mouseleave="mouseColor = ''"
  >
    <svg class="svgClass" aria-hidden="true">
      <use :href="symbolId" :fill="color" />
    </svg>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useThemeStore } from '@/store'

export default defineComponent({
  name: 'SvgIcon',
  props: {
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '20px'
    },
    prefix: {
      type: String,
      default: 'icon'
    },
    icon: {
      type: String,
      required: true
    },
    color: {
      type: String
    }
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.icon}`)
    const currentColor = computed(() => useThemeStore().themeColor)
    const mouseColor = ref()
    return { symbolId, currentColor, mouseColor }
  }
})
</script>
<style scoped lang="scss">
.svgClass {
  width: v-bind(width);
  height: v-bind(height);
  color: v-bind(mouseColor);
}
</style>
