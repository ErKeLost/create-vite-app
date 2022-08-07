// eslint-disable-next-line @typescript-eslint/no-var-requires
const prompts = require('prompts')
import options from '../../../shared/options'
async function createQuestion(util, question) {
  const result = await util(question, {
    onCancel: () => {
      throw new Error('🎨🎨' + ' Operation cancelled')
    }
  })
  Object.assign(options, result)
  //  在 回答问题得时候 map 映射 每一个 库 版本 问题 要不要考虑
  return Promise.resolve(true)
}
export async function runReactQuestions() {
  // 新特性 新预设
}
