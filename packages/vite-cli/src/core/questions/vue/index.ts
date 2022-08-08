// eslint-disable-next-line @typescript-eslint/no-var-requires
const prompts = require('prompts')
import precss from './precss'
import components from './components'
import Plugins from './plugins'
import future from './feature'
import theme from './theme'
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
export async function runVueQuestions() {
  // 新特性 新预设
  await createQuestion(prompts, future)
  // ui library
  await createQuestion(prompts, components)
  // theme
  await createQuestion(prompts, theme)
  // vite plugins
  await createQuestion(prompts, Plugins)
  // css
  await createQuestion(prompts, precss)
}
