// import child_process from 'child_process'
// import chalk from 'chalk'
// import path from 'path'
// import fs from 'fs'
// import ora, { Color } from 'ora'
// import util from 'util'

// const execSync = child_process.execSync
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const exec = util.promisify(require('child_process').exec)

// export class DefaultLogger {
//   private _spinner: ora.Ora

//   public constructor(startText: string) {
//     this._spinner = ora(startText).start()
//   }

//   public log(text: string, color?: Color): void {
//     if (color) {
//       this._spinner.color = color
//     }
//     this._spinner.text = text
//   }

//   public succeed(text: string): void {
//     this._spinner.succeed(text)
//   }

//   public fail(text: string): void {
//     this._spinner.fail(text)
//   }
// }

// export const runSync = (command: string, spinner?: DefaultLogger) => {
//   try {
//     return execSync(command, { cwd: process.cwd(), encoding: 'utf8' })
//   } catch (error) {
//     spinner.fail('task fail')
//     process.exit(1)
//   }
// }

// export const runAsync = async (command: string, spinner?: DefaultLogger) => {
//   try {
//     await exec(command, { cwd: process.cwd(), encoding: 'utf8' })
//   } catch (error) {
//     spinner.fail('task fail')
//     process.exit(1)
//   }
// }

// export const taskPre = (logInfo: string, type: 'start' | 'end') => {
//   if (type === 'start') {
//     return `task start(开始任务): ${logInfo} \r\n`
//   } else {
//     return `task end(任务结束): ${logInfo} \r\n`
//   }
// }

// // 获取项目文件
// export const getProjectPath = (dir = './'): string => {
//   return path.join(process.cwd(), dir)
// }

// export function compose(middleware) {
//   const otherOptions = {}
//   function dispatch(index, otherOptions) {
//     if (index == middleware.length) return
//     const currMiddleware = middleware[index]
//     currMiddleware((addOptions) => {
//       dispatch(++index, { ...otherOptions, ...addOptions })
//     }, otherOptions).catch((error) => {
//       console.log('💣 发布失败，失败原因：', error)
//     })
//   }
//   dispatch(0, otherOptions)
// }

// /**
//  * 获取当前package.json的版本号
//  */
// export const getOriginPackageJson = (): Record<string, any> => {
//   const packageJson = JSON.parse(
//     fs.readFileSync(getProjectPath('package.json'), 'utf-8')
//   )
//   return packageJson
// }

// /**
//  * 工具函数，用来捕获并打印错误，返回false
//  */
// export const basicCatchError = (err: Error) => {
//   console.log(`\r\n ${chalk.red(err)}`)
//   return false
// }
