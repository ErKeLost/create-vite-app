import chalk from 'chalk'
import readline from 'readline'
import { VITE_CLI_VERSION } from '../shared/constant'
export default function (color: string, str: string): void {
  if (process.stdout.isTTY) {
    console.log('')
    const cutLine = ` x-build ${VITE_CLI_VERSION} `
    console.log(
      chalk.bgCyan(
        ' -'.repeat((process.stdout.columns - cutLine.length) / 4) +
          cutLine +
          '- '.repeat((process.stdout.columns - cutLine.length) / 4)
      )
    )
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    console.info(chalk[color](str))
    console.log('')
  }
}
