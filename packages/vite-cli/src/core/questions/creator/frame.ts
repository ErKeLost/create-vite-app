import {
  blue,
  cyan,
  green,
  lightRed,
  magenta,
  red,
  reset,
  yellow
} from 'kolorist'
export default {
  name: 'frame',
  type: 'select',
  message: 'Choose your framework (选择您需要使用的框架)',
  choices: [
    { title: magenta('Vue'), value: 'vue' },
    { title: blue('React') + '🚧🚧', value: 'react', disabled: true },
    { title: cyan('Nuxt') + '🚧🚧', value: 'nuxt' }
  ]
}
