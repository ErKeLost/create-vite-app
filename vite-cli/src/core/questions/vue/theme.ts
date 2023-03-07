import { useThemeUiMap } from '@/compile/vue/vueEjsMapConstant'
import options from '@/compile/vue/options'
export default {
  name: 'useTheme',
  type: () => (useThemeUiMap.includes(options.components) ? 'toggle' : null),
  message:
    'Add theming && layout to your project?  This item overrides some of the default configuration',
  initial: false,
  active: 'Yes',
  inactive: 'No'
}
