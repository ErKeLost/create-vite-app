import { prompt, QuestionCollection } from 'inquirer'
import options from '../../../shared/options'
import precss from './precss'
import components from './components'
import PackageDevice from './packageDevice'
import Plugins from './plugins'
import future from './feature'
import device from './device'
// import prompts from 'prompts'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const prompts = require('prompts')
async function createQuestion(util, question) {
  const result: QuestionCollection = await util(question)
  Object.assign(options, result)
  console.log(result, 'result')
  //  在 回答问题得时候 map 映射 每一个 库 版本 问题 要不要考虑
  return Promise.resolve(true)
}

async function createProjectQuestions(): Promise<void> {
  await createQuestion(prompts, PackageDevice)
  await createQuestion(prompts, future)
  await createQuestion(prompts, device)
  await createQuestion(prompts, components)
  await createQuestion(prompts, Plugins)
  await createQuestion(prompts, precss)
  console.log(options)
  return Promise.resolve()
}

export default createProjectQuestions
