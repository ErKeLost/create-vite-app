import ejs = require('ejs')
import fs = require('fs-extra')
import path = require('path')
import prettier = require('prettier')
import options from '../shared/options'
export async function ejsRender(filePath: string, name): Promise<void> {
  const templatePath = path.resolve(__dirname, '../template')
  const file = path.parse(filePath)
  const dest = path.resolve(process.cwd(), name)
  const readFilePath = path.resolve(dest, file.dir, `${file.name}.ejs`)
  console.log(readFilePath)

  const outputFilePath = path.resolve(dest, filePath)

  const templateCode = await fs.readFile(readFilePath)

  const code = ejs.render(templateCode.toString(), options)
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
        case 'vue':
          prettierCode = prettier.format(
            code,
            Object.assign(opts, { parser: extname })
          )
          break
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
