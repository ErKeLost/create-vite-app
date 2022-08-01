import { shouldUseYarn } from '@/utils/shouldUseYarn'
import { shouldUsePnpm } from '@/utils/shouldUsePnpm'
const isYarnInstalled = shouldUseYarn()
const isPnpmInstalled = shouldUsePnpm()
export default {
  name: 'package',
  type: 'select',
  message: 'Which package manager do you want to use? (选择您的包管理器)',
  choices: [
    {
      title: isPnpmInstalled ? 'Pnpm' : 'Pnpm (pnpm not install)',
      value: 'pnpm'
    },
    {
      title: isYarnInstalled ? 'Yarn' : 'Yarn (yarn not install)',
      value: 'yarn'
    },
    { title: 'Npm', value: 'npm' }
  ]
}
