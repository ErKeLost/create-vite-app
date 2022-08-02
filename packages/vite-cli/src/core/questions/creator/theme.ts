export default {
  name: 'useTheme',
  type: () => 'toggle',
  message:
    'Add theming to your project? Will default and overwrite some of the current configuration(给你的项目添加主题化)',
  initial: false,
  active: 'Yes',
  inactive: 'No'
}
