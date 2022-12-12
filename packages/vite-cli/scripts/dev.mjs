import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
// 获取 __filename 的 ESM 写法
// const __filename = fileURLToPath(import.meta.url)
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
/**
 * 复制文件夹到目标文件夹
 * @param {string} src 源目录
 * @param {string} dest 目标目录
 * @param {function} callback 回调
 */
const copyDir = async (src, dest, callback) => {
  const copy = (copySrc, copyDest) => {
    fs.readdir(copySrc, (err, list) => {
      if (err) {
        callback(err)
        return
      }
      list.forEach((item) => {
        const ss = path.resolve(copySrc, item)
        fs.stat(ss, (err, stat) => {
          if (err) {
            callback(err)
          } else {
            const curSrc = path.resolve(copySrc, item)
            const curDest = path.resolve(copyDest, item)

            if (stat.isFile()) {
              // 文件，直接复制
              fs.createReadStream(curSrc).pipe(fs.createWriteStream(curDest))
            } else if (stat.isDirectory()) {
              // 目录，进行递归
              fs.mkdirSync(curDest, { recursive: true })
              copy(curSrc, curDest)
            }
          }
        })
      })
    })
  }

  // fs.access(dest, (err) => {
  //   if (err) {
  //     // 若目标目录不存在，则创建
  //     fs.mkdirSync(dest, { recursive: true })
  //   }
  //   copy(src, dest)
  // })
  copy(src, dest)
}
console.log(await fs.existsSync('dist'))
if (!(await fs.existsSync('dist'))) {
  await fs.mkdirSync('dist')
}
if (await fs.existsSync('dist')) {
  copyDir('template', 'dist/template', (err) => {
    console.log(err)
  })
}
if (await fs.existsSync('dist')) {
  copyDir('theme', 'dist/theme', (err) => {
    console.log(err)
  })
}
