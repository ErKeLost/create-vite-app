import fs from 'fs-extra'
import path from 'node:path'
import options from '@/shared/options'
import { ejsRender } from '@/utils/ejsRender'
import { loadWithRocketGradient } from '@/utils/gradient'
import { templateFilesMap } from '@/shared/templateFile'
import { getFilterFile } from '@/shared/frameQuestions'

async function copyTemplate() {
  const spinner = await loadWithRocketGradient('copy template')
  // CLI 模板文件夹路径
  options.src = path.resolve(__dirname, `../template/${options.frame}`)
  // 获取基础参数
  const dest = path.resolve(process.cwd(), options.name)
  options.dest = dest
  // 模板路径
  const templatePath = path.resolve(
    __dirname,
    `../../../../../template/${options.frame}`
  )
  options.templatePath = templatePath
  // 拷贝基础模板文件
  const filterFileFn = getFilterFile()

  async function copy() {
    await fs.copy(`${__dirname}/template/${options.frame}`, dest, {
      filter: filterFileFn
    })
  }
  await copy()

  // 生成 gitignore
  await fs.move(
    path.resolve(options.dest, '.gitignore.ejs'),
    path.resolve(options.dest, '.gitignore'),
    { overwrite: true }
  )
  // 编译 ejs 模板文件
  await Promise.all(
    templateFilesMap
      .get(options.frame)()
      .map((file) => ejsRender(file, options.name))
  )
  // 先编译后覆盖主题化文件
  if (options.useTheme) {
    await fs.copy(`${__dirname}/theme/${options.components}`, `${dest}/src`, {
      overwrite: true
    })
  }
  spinner.text = 'Template copied!'
  spinner.succeed()
}
export default copyTemplate
