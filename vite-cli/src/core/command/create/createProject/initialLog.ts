import clearConsole from '../../../../utils/clearConsole'
import { logger } from '../../../../utils/log'
import { VITE_CLI_VERSION } from '../../../../utils/shared/constant'

// eslint-disable-next-line @typescript-eslint/no-var-requires
async function initialLog() {
  clearConsole('')
  logger(`\n🍰 Welcome Use Vite To Create Template! v${VITE_CLI_VERSION}\n`)
}

export default initialLog
