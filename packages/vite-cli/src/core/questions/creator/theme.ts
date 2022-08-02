export default {
  name: 'useTheme',
  type: () => 'toggle',
  message:
    'Add theming && layout to your project? (给你的项目添加主题化, 布局化, 可能会覆盖默认配置)',
  initial: false,
  active: 'Yes',
  inactive: 'No'
}
