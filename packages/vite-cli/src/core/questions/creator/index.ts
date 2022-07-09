import { prompt, QuestionCollection } from 'inquirer'
import options from '../../../shared/options'
import precss from './precss'
import components from './components'
import PackageDevice from './packageDevice'
import Plugins from './plugins'
import future from './feature'
// import prompts from 'prompts'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const prompts = require('prompts')
async function createQuestion(util, question) {
  const result: QuestionCollection = await util(question)
  Object.assign(options, result)
  return Promise.resolve()
}

async function createProjectQuestions(): Promise<void> {
  await createQuestion(prompt, PackageDevice)
  await createQuestion(prompts, future)
  await createQuestion(prompt, components)
  await createQuestion(prompt, Plugins)
  await createQuestion(prompt, precss)
  console.log(options)

  return Promise.resolve()
}

export default createProjectQuestions
