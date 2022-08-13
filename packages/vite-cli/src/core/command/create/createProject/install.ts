import options from '@/shared/options'
import { cyan, yellow } from '@/utils/log'
import createSpawnCmd from '@/utils/createSpawnCmd'
import clearConsole from '@/utils/clearConsole'
import { VITE_CLI_VERSION } from '@/shared/constant'
async function installationDeps() {
  // 目录
  const cmdIgnore = createSpawnCmd(options.dest, 'ignore')
  const cmdInherit = createSpawnCmd(options.dest, 'inherit')
  // 开始记录用时
  const startTime: number = new Date().getTime()
  yellow(
    `> The project template is generated in the directory： ${options.dest}`
  )
  // Git 初始化
  await cmdIgnore('git', ['init'])
  await cmdIgnore('git', ['add .'])
  await cmdIgnore('git', ['commit -m "Initialize by VITE_CLI"'])
  console.log(`> it repository initialized successfully`)

  // 依赖安装
  console.log(
    `> Dependencies are being installed automatically, please wait a moment...`
  )
  console.log('')
  await cmdInherit(options.package, ['install'])

  clearConsole('cyan', `VITE_CLI v${VITE_CLI_VERSION}`)
  const endTime: number = new Date().getTime()
  const usageTime: number = (endTime - startTime) / 1000
  cyan(
    `> 📦📦 Usage time${usageTime} s , Please enter the following command to continue...`
  )
  console.log('')
  cyan('Project created successfully')
  console.log('')
  cyan(` cd ${options.name}`)
  cyan(
    options.package === 'npm'
      ? ` ${options.package} run dev`
      : ` ${options.package} dev`
  )
}
export default installationDeps
