import { cyan, yellow } from '@/utils/log'
import { ejsRender } from '@/utils/createTemplate'
import createSpawnCmd from '@/utils/createSpawnCmd'
import { readdirSync } from 'fs'
import fs = require('fs-extra')
import { fetchTemplateFiles } from '@/shared/templateFile'
import createProjectQuestions from '@/core/questions/creator'
import clearConsole from '@/utils/clearConsole'
import { VITE_CLI_VERSION } from '@/shared/constant'
import options from '@/shared/options'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const gradient = require('gradient-string')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
let startTime: number, endTime: number
export default async function () {
  clearConsole('cyan', `🎨  🎨   VITE_CLI V-${VITE_CLI_VERSION}   🎨  🎨`)
  console.log(
    gradient('cyan', 'purple')('\n🚀 Welcome To Create Template for Vite!\n')
  )

  await createProjectQuestions()
  console.log(options.name, '🎨  🎨🎨  🎨')

  // CLI 模板文件夹路径
  options.src = path.resolve(__dirname, `../template/${options.frame}`)
  // 获取基础参数
  // options.name = name
  options.dest = path.resolve(process.cwd(), options.name)

  // 目录
  const dest = path.resolve(process.cwd(), options.name)

  const cmdIgnore = createSpawnCmd(dest, 'ignore')
  const cmdInherit = createSpawnCmd(dest, 'inherit')
  // 模板路径
  const templatePath = path.resolve(
    __dirname,
    `../../../../../template/${options.frame}`
  )
  // 修复 frame work bug
  const assets = readdirSync(`${templatePath}/src/assets`).filter(
    (item) => !item.includes('logo')
  )
  function filterQuestion() {
    const res = assets.filter(
      (item) => item.split('.')[0] !== options.components
    )
    res.forEach((item) => {
      fs.remove(`${dest}/src/assets/${item}`)
    })
    if (!options.Router) {
      fs.remove(`${dest}/src/router`)
    }
    if (!options.Eslint) {
      fs.remove(`${dest}/.prettierrc.js`)
    }
    if (!options.Prettier) {
      fs.remove(`${dest}/.eslintrc.js`)
    }
    if (!options.plugins.includes('html')) {
      fs.remove(`${dest}/build/vite/html.ts`)
    }
    return true
  }
  // 开始记录用时
  startTime = new Date().getTime()
  // 拷贝基础模板文件
  await fs.copy(templatePath, dest, { filter: filterQuestion })
  await fs.copy(templatePath, dest)
  // 编译 ejs 模板文件
  await Promise.all(
    fetchTemplateFiles().map((file) => ejsRender(file, options.name))
  )
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
  await cmdInherit(options.package, ['install'])

  clearConsole('cyan', `VITE_CLI v${VITE_CLI_VERSION}`)
  endTime = new Date().getTime()
  const usageTime = (endTime - startTime) / 1000
  cyan(`> 项目已经创建成功，用时${usageTime}s，请输入以下命令继续...`)
  console.log('')
  cyan(`✨✨ cd ${options.name}`)
  cyan(
    options.package === 'npm'
      ? `✨✨ ${options.package} run dev`
      : `✨✨ ${options.package} dev`
  )
  cyan('创建项目成功')
}
