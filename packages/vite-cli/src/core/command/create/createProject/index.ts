import { ejsRender } from '@/utils/createTemplate'
import fs = require('fs-extra')
import { templateFilesMap } from '@/shared/templateFile'
import createProjectQuestions from '@/core/questions/creator'
import clearConsole from '@/utils/clearConsole'
import { VITE_CLI_VERSION } from '@/shared/constant'
import options from '@/shared/options'
import { getFilterFile } from '@/shared/frameQuestions'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const gradient = require('gradient-string')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
import installationDeps from './install'
export default async function () {
  clearConsole('cyan', `🎨🎨   VITE_CLI V-${VITE_CLI_VERSION}   🎨🎨`)
  console.log(
    gradient('cyan', 'purple')('\n🚀 Welcome To Create Template for Vite!\n')
  )

  await createProjectQuestions()
  console.log(options.name, '🎨🎨🎨🎨')

  // CLI 模板文件夹路径
  options.src = path.resolve(__dirname, `../template/${options.frame}`)
  // 获取基础参数
  // options.name = name
  const dest = path.resolve(process.cwd(), options.name)

  options.dest = dest

  // 模板路径
  const templatePath = path.resolve(
    __dirname,
    `../../../../../template/${options.frame}`
  )
  options.templatePath = templatePath
  // 开始记录用时
  const res = await getFilterFile()
  // 拷贝基础模板文件
  await fs.copy(`${__dirname}/template/${options.frame}`, dest, { filter: res })
  // 编译 ejs 模板文件
  await Promise.all(
    templateFilesMap
      .get(options.frame)()
      .map((file) => ejsRender(file, options.name))
  )
  // 安装依赖
  await installationDeps()
}
