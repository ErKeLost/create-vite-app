// /**
//  * 执行终端命令
//  *
//  */

// import { spawn } from 'child_process'

// const commandSpawn = (...args: [any, any, any]) => {
//   return new Promise((resolve, reject) => {
//     const childProcess = spawn(...args)
//     childProcess.stdout.pipe(process.stdout)
//     childProcess.stderr.pipe(process.stderr)
//     childProcess.on('close', () => {
//       resolve('done')
//     })
//   })
// }

// export default commandSpawn
