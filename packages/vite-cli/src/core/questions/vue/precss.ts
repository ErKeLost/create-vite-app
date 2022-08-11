export default {
  name: 'precss',
  type: 'select',
  message: 'Select CSS preprocessor',
  choices: [
    { title: 'Sass/Scss', value: 'scss' },
    { title: 'Less', value: 'less' },
    { title: '不使用', value: '' }
  ]
}
