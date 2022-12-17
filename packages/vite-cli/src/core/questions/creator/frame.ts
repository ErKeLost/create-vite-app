import chalk from 'chalk'
export default {
  name: 'frame',
  type: 'select',
  message: 'Choose your framework',
  choices: [
    { title: chalk.magenta('Vue'), value: 'vue' },
    { title: chalk.blue('React') + '🚧🚧', value: 'react', disabled: true },
    { title: chalk.cyan('Nuxt') + '🚧🚧', value: 'nuxt', disabled: true },
    { title: chalk.cyan('Next') + '🚧🚧', value: 'next', disabled: true }
  ]
}
