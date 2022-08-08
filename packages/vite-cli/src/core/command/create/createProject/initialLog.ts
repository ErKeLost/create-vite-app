import clearConsole from '@/utils/clearConsole'
import { VITE_CLI_VERSION } from '@/shared/constant'
import gradient from 'gradient-string'
async function initialLog() {
  clearConsole('cyan', `🎨🎨   VITE_CLI V-${VITE_CLI_VERSION}   🎨🎨`)
  console.log(
    gradient('cyan', 'purple')('\n🚀 Welcome To Create Template for Vite!\n')
  )
}

export default initialLog
