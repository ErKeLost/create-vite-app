export default {
  name: 'useTheme',
  type: () => 'toggle',
  message:
    'Add theming && layout to your project? (给你的项目添加主题化, 布局化, 此项会覆盖部分默认配置)',
  initial: false,
  active: 'Yes',
  inactive: 'No'
}
