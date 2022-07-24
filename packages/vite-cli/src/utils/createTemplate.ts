import ejs = require('ejs')
import fs = require('fs-extra')
import path = require('path')
import prettier = require('prettier')
import options from '../shared/options'
export async function ejsRender(filePath: string, name): Promise<void> {
  // 根目录template 绝对路径
  const templatePath = path.resolve(__dirname, `../template/${options.frame}`)
  // 获取当前渲染文件的 各种 参数 such as ext
  const file = path.parse(filePath)
  // 编译根目录 创建的根目录
  const dest = path.resolve(process.cwd(), name)
  // 当前 需要编译的 ejs文件
  const readFilePath = path.resolve(dest, file.dir, `${file.name}.ejs`)
  // 转换 之后的 js or ts or vue 文件
  const outputFilePath = path.resolve(dest, filePath)
  // 是一个buffer
  const templateCode = await fs.readFile(readFilePath)
  // 编译当前code
  const code = ejs.render(templateCode.toString(), options)
  // 获取后缀
  const extname = path.extname(filePath).replace(/[.]/g, '')
  let prettierCode: string
  await prettier
    .resolveConfig(templatePath)
    .then((opts) => {
      switch (extname) {
        case 'ts':
          prettierCode = prettier.format(code, { parser: 'babel', ...opts })
          break
        case 'js':
          prettierCode = prettier.format(code, { parser: 'babel', ...opts })
          break
        // case 'vue':
        //   prettierCode = prettier.format(code, { parser: 'babel', ...opts })
        //   break
        default:
          prettierCode = prettier.format(code, { parser: extname })
          break
      }
    })
    .catch((err) => {
      console.log(err)
    })

  await fs.outputFile(outputFilePath, prettierCode)
  await fs.remove(readFilePath)
}
