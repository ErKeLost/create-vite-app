import { prompt, QuestionCollection } from 'inquirer'
import options from '../../../shared/options'
import precss from './precss'
import components from './components'
import PackageDevice from './packageDevice'
import Plugins from './plugins'
import Router from './router'
import Pinia from './pinia'
// import prompts from 'prompts'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const prompts = require('prompts')
async function createQuestion(quesiton) {
  const result: QuestionCollection = await prompt([quesiton])
  Object.assign(options, result)
  return Promise.resolve()
}

async function createProjectQuestions(): Promise<void> {
  await createQuestion(PackageDevice)
  await createQuestion(Router)
  await createQuestion(Pinia)
  const res = await prompts([
    {
      name: 'needsRouter',
      type: () => 'toggle',
      message: 'Add Vue Router for Single Page Application development?',
      initial: false,
      active: 'Yes',
      inactive: 'No'
    },
    {
      name: 'needsPinia',
      type: () => 'toggle',
      message: 'Add Pinia for state management?',
      initial: false,
      active: 'Yes',
      inactive: 'No'
    }
  ])
  await createQuestion(components)
  await createQuestion(Plugins)
  await createQuestion(precss)
  Object.assign(options, res)
  console.log(options)

  return Promise.resolve()
}

export default createProjectQuestions
