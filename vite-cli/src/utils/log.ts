import chalk from 'chalk'
import gradient from 'gradient-string'

export const red = (args: string | number) => console.log(chalk.red(args))
export const green = (res: string | number) => console.log(chalk.green(res))
export const gray = (res: string | number) => console.log(chalk.gray(res))
export const yellow = (res: string | number) => console.log(chalk.yellow(res))
export const blue = (res: string | number) => console.log(chalk.blue(res))
export const magenta = (res: string | number) => console.log(chalk.magenta(res))
export const black = (res: string | number) => console.log(chalk.black(res))
export const cyan = (res: string | number) => console.log(chalk.cyan(res))
export const bgGreen = (res: unknown) => console.log(chalk.bgGreen(res))
export const bgRed = (res: unknown) => console.log(chalk.bgRed(res))
export const bgYellow = (res: unknown) => console.log(chalk.bgYellow(res))
export const bgGray = (res: unknown) => console.log(chalk.bgGray(res))
export const bgBlue = (res: unknown) => console.log(chalk.bgBlue(res))
export const bgMagenta = (res: unknown) => console.log(chalk.bgMagenta(res))
export const bgCyan = (...res: unknown[]) => console.log(chalk.bgCyan(...res))

export const complete = (name, dest, type, description) => {
  green(`\n ${description}`)
  cyan(`\n To get started with into "${name}.${type}"`)
  console.log(`\n cd ${dest} \n`)
}
export function logger(string: string) {
  console.log(gradient('#9CECFB', '#65C7F7', '#0052D4')(string))
  console.log('')
}
