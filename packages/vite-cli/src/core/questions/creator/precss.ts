export default {
  name: 'precss',
  type: 'select',
  message: '选择 CSS 预处理器',
  choices: [
    { title: 'Sass/Scss', value: 'scss' },
    { title: 'Less', value: 'less' },
    { title: '不使用', value: '' }
  ]
}
