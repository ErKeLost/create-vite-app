import { cyan, yellow } from '../../../../utils/log'
import { ejsRender } from '../../../../utils/createTemplate'
import createSpawnCmd from '../../../../utils/createSpawnCmd'
import fs = require('fs-extra')
import { fetchTemplateFiles } from '../../../../shared/templateFile'
import createProjectQuestions from '../../../questions/creator'
import clearConsole from '../../../../utils/clearConsole'
import { VITE_CLI_VERSION } from '../../../../shared/constant'
import options from '../../../../shared/options'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
let startTime: number, endTime: number
export default async function (name: string) {
  // CLI 模板文件夹路径
  options.src = path.resolve(__dirname, '../template')
  // 获取基础参数
  options.name = name
  options.dest = path.resolve(process.cwd(), name)
  // 模板路径
  const templatePath = path.resolve(__dirname, '../../../../../template')
  console.log(templatePath)
  // 目录
  const dest = path.resolve(process.cwd(), name)
  console.log(dest)

  const cmdIgnore = createSpawnCmd(dest, 'ignore')
  const cmdInherit = createSpawnCmd(dest, 'inherit')
  clearConsole('cyan', `🎨  🎨   VITE_CLI V-${VITE_CLI_VERSION}   🎨  🎨`)
  await createProjectQuestions()
  console.log(options)

  // 开始记录用时
  startTime = new Date().getTime()
  // 拷贝基础模板文件
  await fs.copy(templatePath, dest)
  // 编译 ejs 模板文件
  await Promise.all(fetchTemplateFiles().map((file) => ejsRender(file, name)))
  yellow(`> 项目模板生成于目录： ${dest}`)
  // 生成 gitignore
  await fs.move(
    path.resolve(dest, '.gitignore.ejs'),
    path.resolve(dest, '.gitignore'),
    { overwrite: true }
  )
  // Git 初始化
  await cmdIgnore('git', ['init'])
  await cmdIgnore('git', ['add .'])
  await cmdIgnore('git', ['commit -m "Initialize by VITE_CLI"'])
  console.log(`> 成功初始化 Git 仓库`)

  // 依赖安装
  console.log(`> 正在自动安装依赖，请稍等...`)
  console.log('')
  // await cmdInherit('npm', ['install'])
  // await cmdInherit('yarn', ['install'])
  await cmdInherit(options.package, ['install'])

  clearConsole('cyan', `VITE_CLI v${VITE_CLI_VERSION}`)
  endTime = new Date().getTime()
  const usageTime = (endTime - startTime) / 1000
  cyan(`> 项目已经创建成功，用时${usageTime}s，请输入以下命令继续...`)
  console.log('')
  cyan(`cd ${name}`)
  cyan('npm run dev')
  console.log('创建项目成功')
}
