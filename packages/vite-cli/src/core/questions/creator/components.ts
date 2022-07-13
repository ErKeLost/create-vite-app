export default {
  type: 'select', // select
  name: 'components', //
  message: 'choose UI frameWork (选择您的 UI 框架)',
  choices: [
    { title: 'Vuetify3 Beta', value: 'vuetify' },
    { title: 'Element Plus', value: 'element-plus' },
    { title: 'Ant Design Vue 2.x', value: 'ant-design' },
    { title: 'Naive UI', value: 'naive-ui' },
    { title: 'Vant 3.x', value: 'vant' }
  ]
}
