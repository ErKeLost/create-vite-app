import options from '@/shared/options'
import prompts from 'prompts'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const prompts = require('prompts')
export default async function createQuestion(question) {
  const result = await prompts(question, {
    onCancel: () => {
      throw new Error('🎨🎨' + ' Operation cancelled')
    }
  })
  Object.assign(options, result)
  //  在 回答问题得时候 map 映射 每一个 库 版本 问题 要不要考虑
  return Promise.resolve(options)
}
