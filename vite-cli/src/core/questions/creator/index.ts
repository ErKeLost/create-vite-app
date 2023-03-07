// import device from './device'
import PackageDevice from './packageManager'
import frame from './frame'
import projectName from './projectName'
import { frameQuestions } from '@/compile/common/frameQuestions'
import options from '@/compile/vue/options'
import createQuestion from '@/utils/question'
import npmMirror from './npmMirror'
async function createProjectQuestions(): Promise<void> {
  // 项目名
  try {
    await createQuestion(projectName)
    // 选择框架
    await createQuestion(frame)
    // 包管理器版本
    await createQuestion(PackageDevice)
    // Use NpmMirror
    // await createQuestion(npmMirror)
    // pc or mobile
    // await createQuestion(prompts, device)
    // 根据不同框架继续走不同任务
    await frameQuestions.get(options.frame)()
  } catch (cancelled) {
    // cancel
    console.log(cancelled.message)
    process.exit(1)
  }
  // options 对象属性 所有 属性
  // 获取 选中 components
  return Promise.resolve()
}

export default createProjectQuestions
