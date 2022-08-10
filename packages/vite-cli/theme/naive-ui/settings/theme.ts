/** 布局组件的名称 */
export enum EnumLayoutComponentName {
  basic = 'basic-layout',
  blank = 'blank-layout'
}

/** 布局模式 */
export enum EnumThemeLayoutMode {
  'vertical' = '左侧菜单模式',
  'horizontal' = '顶部菜单模式',
  'vertical-mix' = '左侧菜单混合模式',
  'horizontal-mix' = '顶部菜单混合模式'
}

/** 多页签风格 */
export enum EnumThemeTabMode {
  'chrome' = '谷歌风格',
  'button' = '按钮风格'
}

/** 水平模式的菜单位置 */
export enum EnumThemeHorizontalMenuPosition {
  'flex-start' = '居左',
  'center' = '居中',
  'flex-end' = '居右'
}

/** 过渡动画类型 */
export enum EnumThemeAnimateMode {
  'zoom-fade' = '渐变',
  'zoom-out' = '闪现',
  'fade-slide' = '滑动',
  'fade' = '消退',
  'fade-bottom' = '底部消退',
  'fade-scale' = '缩放消退',
  'bounceInUp' = '由内向上',
  'bounceInDown' = '由内向下',
  'bounceInLeft' = '由内向左',
  'bounceInRight' = '由内向右',
  'backInRight' = '向右返回弹跳',
  'backInLeft' = '向左返回弹跳',
  'backInDown' = '向下返回弹跳',
  'backInUp' = '向上返回弹跳'
}

import jsonSetting from './theme.json'

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
  themeColor: '#ffbbaa',
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
    collapsedWidth: 84,
    mixWidth: 84,
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

export const themeSetting =
  defaultThemeSetting || (jsonSetting as Theme.Setting)
