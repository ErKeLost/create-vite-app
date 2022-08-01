export default {
  name: 'package',
  type: 'select',
  message: 'Which package manager do you want to use? (选择您的包管理器)',
  choices: [
    { title: 'Pnpm', value: 'pnpm' },
    { title: 'Yarn', value: 'yarn' },
    { title: 'Npm', value: 'npm' }
  ]
}
