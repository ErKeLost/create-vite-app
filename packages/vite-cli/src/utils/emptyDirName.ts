import fs from 'fs-extra'
import path from 'node:path'

export default function (name: string): boolean {
  // 目标目录路径
  const targetDir = path.resolve(process.cwd(), name)

  if (!fs.existsSync(targetDir)) {
    return true
  }

  const files = fs.readdirSync(targetDir)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
}
