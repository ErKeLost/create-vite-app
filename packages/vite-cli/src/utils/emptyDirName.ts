import { access } from 'fs/promises'
import { constants } from 'fs'
import { red } from '../utils/log'

export default async function (name: string): Promise<boolean> {
  // access 操作文件异步执行所有操作 不会阻塞事件循环 完成或者 错误时调用回调函数
  // name 为指定目录 或者 文件 没有 返回null
  try {
    await access(name, constants.R_OK | constants.W_OK)
    red(
      `The ${name} folder already exists in the current directory. Please try to use another project name!`
    )
    red(`${name} 文件夹已经存在当前目录. 请使用其他名称命名!`)
    process.exit(1)
  } catch {
    return true
  }
}
