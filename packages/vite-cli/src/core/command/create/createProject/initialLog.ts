import clearConsole from '@/utils/clearConsole'
import { VITE_CLI_VERSION } from '@/shared/constant'
import gradient from 'gradient-string'
// eslint-disable-next-line @typescript-eslint/no-var-requires
async function initialLog() {
  clearConsole('')
  console.log(
    gradient('cyan', 'purple')('\n🍰 Welcome Use Vite To Create Template!\n')
  )
}

export default initialLog
