import {
  EnumThemeLayoutMode,
  EnumThemeHorizontalMenuPosition,
  EnumThemeAnimateMode
} from '@/enum'
import jsonSetting from '../theme.json'

const themeColorList = [
  '#1890ff',
  '#409EFF',
  '#2d8cf0',
  '#007AFF',
  '#5ac8fa',
  '#5856D6',
  '#536dfe',
  '#9c27b0',
  '#AF52DE',
  '#0096c7',
  '#00C1D4',
  '#34C759',
  '#43a047',
  '#7cb342',
  '#c0ca33',
  '#78DEC7',
  '#e53935',
  '#d81b60',
  '#f4511e',
  '#fb8c00',
  '#ffb300',
  '#fdd835',
  '#6d4c41',
  '#546e7a'
]

const defaultThemeSetting: Theme.Setting = {
  name: 'tianfeng',
  followSystemTheme: true,
  darkMode: false,
  layout: {
    minWidth: 1200,
    mode: import.meta.env.VITE_LAYOUT_MODE,
    modeList: [
      { value: 'vertical', label: EnumThemeLayoutMode.vertical },
      { value: 'vertical-mix', label: EnumThemeLayoutMode['vertical-mix'] },
      { value: 'horizontal', label: EnumThemeLayoutMode.horizontal },
      { value: 'horizontal-mix', label: EnumThemeLayoutMode['horizontal-mix'] }
    ]
  },
  themeColor: import.meta.env.VITE_THEME_COLOR,
  themeColorList,
  otherColor: {
    info: '#2080f0',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d'
  },
  isCustomizeInfoColor: false,
  fixedHeaderAndTab: true,
  showReload: true,
  header: {
    bgColor: '#ffffff',
    inverted: false,
    visible: true,
    height: 60,
    crumb: {
      visible: true,
      showIcon: true
    }
  },
  tab: {
    visible: true,
    height: 44,
    bgColor: '#f5f6f9',
    isCache: true,
    tabMoveable: true
  },
  sider: {
    visible: true,
    inverted: false,
    width: 240,
    collapsedWidth: 64,
    mixWidth: 80,
    mixCollapsedWidth: 48,
    mixChildMenuWidth: 200,
    fixedSider: true
  },
  menu: {
    horizontalPosition: 'flex-start',
    horizontalPositionList: [
      {
        value: 'flex-start',
        label: EnumThemeHorizontalMenuPosition['flex-start']
      },
      { value: 'center', label: EnumThemeHorizontalMenuPosition.center },
      { value: 'flex-end', label: EnumThemeHorizontalMenuPosition['flex-end'] }
    ]
  },
  footer: {
    visible: true,
    fixed: true,
    height: 48
  },
  page: {
    animate: true,
    animateMode: 'fade-slide',
    animateModeList: [
      { value: 'fade-slide', label: EnumThemeAnimateMode['fade-slide'] },
      { value: 'fade', label: EnumThemeAnimateMode.fade },
      { value: 'fade-bottom', label: EnumThemeAnimateMode['fade-bottom'] },
      { value: 'fade-scale', label: EnumThemeAnimateMode['fade-scale'] },
      { value: 'zoom-fade', label: EnumThemeAnimateMode['zoom-fade'] },
      { value: 'zoom-out', label: EnumThemeAnimateMode['zoom-out'] },
      { value: 'bounceInUp', label: EnumThemeAnimateMode['bounceInUp'] },
      { value: 'bounceInDown', label: EnumThemeAnimateMode['bounceInDown'] },
      { value: 'bounceInLeft', label: EnumThemeAnimateMode['bounceInLeft'] },
      { value: 'bounceInRight', label: EnumThemeAnimateMode['bounceInRight'] },
      { value: 'backInRight', label: EnumThemeAnimateMode['backInRight'] },
      { value: 'backInLeft', label: EnumThemeAnimateMode['backInLeft'] },
      { value: 'backInDown', label: EnumThemeAnimateMode['backInDown'] },
      { value: 'backInUp', label: EnumThemeAnimateMode['backInUp'] }
    ]
  }
}

// chore layout setting change
// export const themeSetting =
//   (jsonSetting as Theme.Setting) || defaultThemeSetting

export default defaultThemeSetting || (jsonSetting as Theme.Setting)
