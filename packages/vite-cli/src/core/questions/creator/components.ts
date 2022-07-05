export default {
  name: 'components',
  type: 'list',
  message: '选择 UI 框架',
  choices: [
    { name: 'Vuetify3 Beta', value: 'vuetify' },
    { name: 'Element Plus', value: 'element' },
    { name: 'Ant Design Vue 2.x', value: 'antd' },
    { name: 'Naive UI', value: 'naive' },
    { name: 'Vant 3.x', value: 'vant' }
  ]
}
