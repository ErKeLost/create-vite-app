export default {
  name: 'package',
  type: 'select',
  message: 'Select your package manager (选择您的包管理器)',
  choices: [
    { title: 'Pnpm', value: 'pnpm' },
    { title: 'Yarn', value: 'yarn' },
    { title: 'Npm', value: 'npm' }
  ]
}
