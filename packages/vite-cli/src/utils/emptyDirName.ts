import { access } from 'fs/promises'
import { constants } from 'fs'
import { cyan } from '../utils/log'

export default async function (name: string): Promise<boolean> {
  // access 操作文件异步执行所有操作 不会阻塞事件循环 完成或者 错误时调用回调函数
  // name 为指定目录 或者 文件 没有 返回null
  try {
    await access(name, constants.R_OK | constants.W_OK)
    // cyan(
    //   ` ️🚨 Oops, "${name}" already exists. Please try again with a different directory.`
    // )
    // process.exit(1)
    return false
  } catch {
    return true
  }
}
