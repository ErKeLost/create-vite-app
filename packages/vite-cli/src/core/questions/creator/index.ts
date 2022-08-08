import device from './device'
import PackageDevice from './packageManager'
import frame from './frame'
import prompts from 'prompts'
import projectName from './projectName'
import { frameQuestions } from '@/shared/frameQuestions'
import options from '@/shared/options'
import createQuestion from '@/utils/question'
async function createProjectQuestions(): Promise<void> {
  // 项目名
  try {
    await createQuestion(prompts, projectName)
    // 选择框架
    await createQuestion(prompts, frame)
    // 包管理器版本
    await createQuestion(prompts, PackageDevice)
    // pc or mobile
    await createQuestion(prompts, device)
    await frameQuestions.get(options.frame)()

    // cancel
  } catch (cancelled) {
    console.log(cancelled.message)
    process.exit(1)
  }
  // options 对象属性 所有 属性
  // 获取 选中 components
  console.log(options)
  return Promise.resolve()
}

export default createProjectQuestions
