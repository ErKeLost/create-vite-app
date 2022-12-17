import options from '@/shared/options'
import { cyan } from '@/utils/log'
import createSpawnCmd from '@/utils/createSpawnCmd'
import clearConsole from '@/utils/clearConsole'
import { VITE_CLI_VERSION } from '@/shared/constant'
// eslint-disable-next-line @typescript-eslint/no-var-requires
import gradient from 'gradient-string'
async function notInstallationDeps() {
  // 目录
  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  console.log(process.env)
  console.log(pkgInfo)
  const cmdIgnore = createSpawnCmd(options.dest, 'ignore')
  // 开始记录用时
  const startTime: number = new Date().getTime()
  console.log(
    gradient(
      'cyan',
      'purple'
    )(`> The project template is generated in the directory： ${options.dest}`)
  )
  // Git 初始化
  await cmdIgnore('git', ['init'])
  await cmdIgnore('git', ['add .'])
  await cmdIgnore('git', ['commit -m "Initialize by VITE_CLI"'])
  console.log(`> repository initialized successfully`)
  clearConsole(`VITE_CLI v${VITE_CLI_VERSION}`)
  const endTime: number = new Date().getTime()
  const usageTime: number = (endTime - startTime) / 1000
  cyan(
    `> 📦📦 Usage time ${usageTime}s , Please enter the following command to continue...`
  )
  console.log('')
  cyan('Project created successfully')
  // console.log('')
  // cyan(`cd ${options.name}`)
  // cyan(
  //   options.package === 'npm'
  //     ? `${options.package} run install`
  //     : `${options.package} install`
  // )
  // cyan(
  //   options.package === 'npm'
  //     ? `${options.package} run dev`
  //     : `${options.package} dev`
  // )
}
export default notInstallationDeps

function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1]
  }
}
