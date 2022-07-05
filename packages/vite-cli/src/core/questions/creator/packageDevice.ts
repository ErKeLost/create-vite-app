export default {
  name: 'package',
  type: 'list',
  message: '选择您的包管理器',
  choices: [
    { name: 'Pnpm', value: 'pnpm' },
    { name: 'Yarn', value: 'yarn' },
    { name: 'Npm', value: 'npm' }
  ]
}
