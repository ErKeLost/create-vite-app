import clearConsole from '@/utils/clearConsole'
import { logger } from '@/utils/log'

// eslint-disable-next-line @typescript-eslint/no-var-requires
async function initialLog() {
  clearConsole('')
  logger('\n🍰 Welcome Use Vite To Create Template!\n')
}

export default initialLog
