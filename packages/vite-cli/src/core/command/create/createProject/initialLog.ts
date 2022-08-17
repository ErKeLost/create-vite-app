import clearConsole from '@/utils/clearConsole'
import { VITE_CLI_VERSION } from '@/shared/constant'
// import gradient from 'gradient-string'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const gradient = require('gradient-string')
async function initialLog() {
  clearConsole('cyan', `📦📦 Create Vite App v${VITE_CLI_VERSION} `)
  console.log(
    gradient('cyan', 'purple')('\n🚀 Welcome To Create Template for Vite!\n')
  )
}

export default initialLog
