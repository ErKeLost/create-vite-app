import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
// 获取 __filename 的 ESM 写法
const __filename = fileURLToPath(import.meta.url)
// 获取 __dirname 的 ESM 写法
const __dirname = dirname(fileURLToPath(import.meta.url))
function copyFolder(copiedPath, resultPath, direct) {
  if (!direct) {
    copiedPath = path.join(__dirname, copiedPath)
    resultPath = path.join(__dirname, resultPath)
  }

  function createDir(dirPath) {
    fs.mkdirSync(dirPath)
  }

  if (fs.existsSync(copiedPath)) {
    createDir(resultPath)
    /**
     * @des 方式一：利用子进程操作命令行方式
     */
    // child_process.spawn('cp', ['-r', copiedPath, resultPath])

    /**
     * @des 方式二：
     */
    const files = fs.readdirSync(copiedPath, { withFileTypes: true })
    for (let i = 0; i < files.length; i++) {
      const cf = files[i]
      const ccp = path.join(copiedPath, cf.name)
      const crp = path.join(resultPath, cf.name)
      if (cf.isFile()) {
        /**
         * @des 创建文件,使用流的形式可以读写大文件
         */
        const readStream = fs.createReadStream(ccp)
        const writeStream = fs.createWriteStream(crp)
        readStream.pipe(writeStream)
      } else {
        try {
          /**
           * @des 判断读(R_OK | W_OK)写权限
           */
          fs.accessSync(path.join(crp, '..'), fs.constants.W_OK)
          copyFolder(ccp, crp, true)
        } catch (error) {
          console.log('folder write error:', error)
        }
      }
    }
  } else {
    console.log('do not exist path: ', copiedPath)
  }
}
console.log(await fs.existsSync('dist'))
if (!(await fs.existsSync('dist'))) {
  await fs.mkdirSync('dist')
}
if (!(await fs.existsSync('dist'))) {
  copyFolder("../template", "../dist/template")
}
if (!(await fs.existsSync('dist'))) {
  copyFolder("../theme", "../dist/theme")
}
