import { cyan } from './log'
import readline from 'readline'
import { VITE_CLI_VERSION } from '../shared/constant'
export default function (str: string): void {
  if (process.stdout.isTTY) {
    console.log('')
    const cutLine = ` VITE_CLI ${VITE_CLI_VERSION} `
    // bgCyan(
    //   ' ~'.repeat((process.stdout.columns - cutLine.length) / 4) +
    //     cutLine +
    //     '~ '.repeat((process.stdout.columns - cutLine.length) / 4)
    // )
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    // cyan(str)
    console.log('')
  }
}
