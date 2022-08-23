import createProjectQuestions from '@/core/questions/creator'
import initialLog from './initialLog'
import installationDeps from './install'
import copyTemplate from './copyTemplate'

export default async function () {
  // 初始化 log
  await initialLog() // 共通
  // 命令交互
  await createProjectQuestions() // 不共同
  // 复制模板
  // await copyTemplate() // 共通
  // 安装依赖
  // await installationDeps() // 共通
}
