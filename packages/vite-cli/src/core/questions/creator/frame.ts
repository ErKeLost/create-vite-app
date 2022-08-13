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
  message: 'Choose your framework',
  choices: [
    { title: magenta('Vue'), value: 'vue' },
    { title: blue('React') + '🚧🚧', value: 'react', disabled: true },
    { title: cyan('Nuxt') + '🚧🚧', value: 'nuxt', disabled: true }
  ]
}
