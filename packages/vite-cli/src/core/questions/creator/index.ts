import { prompt, QuestionCollection } from 'inquirer'
import options from '../../../shared/options'
import precss from './precss'
import components from './components'

async function createQuestion(quesiton) {
  const result: QuestionCollection = await prompt([quesiton])
  Object.assign(options, result)
  return Promise.resolve()
}

async function createProjectQuestions(): Promise<void> {
  await createQuestion(components)
  await createQuestion(precss)
  console.log(options)

  return Promise.resolve()
}

export default createProjectQuestions
