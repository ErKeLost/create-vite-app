import program from '../../program'
import createProjectQuestions from '@/core/questions/creator'
import initialLog from './createProject/initialLog'
import installationDeps from './createProject/install'
import copyTemplate from './createProject/copyTemplate'
async function createProject() {
  // 初始化 log
  await initialLog() // 共通
  // 命令交互
  await createProjectQuestions() // 不共同
  // 复制模板
  await copyTemplate() // 共通
  // 安装依赖
  await installationDeps() // 共通
  // 不安装依赖
  // await notInstallationDeps()
}

export default async function createCommand() {
  program
    .description('init Vue3 + Vite3 + Typescript project   📑  📑')
    .action(async () => {
      createProject()
    })
}
