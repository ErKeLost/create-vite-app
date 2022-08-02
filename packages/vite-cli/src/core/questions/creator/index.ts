// import { prompt, QuestionCollection } from 'inquirer'
import options from '../../../shared/options'
import precss from './precss'
import components from './components'
import PackageDevice from './packageManager'
import Plugins from './plugins'
import future from './feature'
import device from './device'
import frame from './frame'
import theme from './theme'
import projectName from './projectName'
import {
  componentsMap,
  futureMap,
  lintMap,
  pluginMap,
  pluginImportStatement,
  componentResolverMap
} from './ejsMapConstant'
// import prompts from 'prompts'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const prompts = require('prompts')
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

async function createProjectQuestions(): Promise<void> {
  // 项目名
  try {
    await createQuestion(prompts, projectName)
    // 选择框架
    await createQuestion(prompts, frame)
    // 包管理器版本
    await createQuestion(prompts, PackageDevice)
    // 新特性 新预设
    await createQuestion(prompts, future)
    // pc or mobile
    await createQuestion(prompts, device)
    // ui library
    await createQuestion(prompts, components)
    // theme
    await createQuestion(prompts, theme)
    // vite plugins
    await createQuestion(prompts, Plugins)
    // css
    await createQuestion(prompts, precss)
    // cancel
  } catch (cancelled) {
    console.log(cancelled.message)
    process.exit(1)
  }
  // options 对象属性 所有 属性
  // 获取 选中 components
  // console.log(componentsMap.get(options.components))
  const currentLibrary = componentsMap.get(options.components)
  const Eslint = lintMap.get('Eslint')
  const Prettier = lintMap.get('Prettier')
  const Router = futureMap.get('Router')
  const Pinia = futureMap.get('Pinia')
  const currentComponentResolver = componentResolverMap.get(options.components)
  options.ui = currentLibrary
  options.ComponentResolver = currentComponentResolver
  options.EslintScript = lintMap.get('EslintScript')
  options.PrettierScript = lintMap.get('PrettierScript')
  options.EslintWithPrettierScript = lintMap.get('EslintWithPrettierScript')
  options.Eslint = Eslint
  options.Prettier = Prettier
  options.Router = Router
  options.Pinia = Pinia
  options.pluginList = options.plugins
    .map((item) => {
      return pluginMap.get(item)
    })
    .reduce((total, next) => total + next, '')

  options.pluginImportStatement = options.plugins
    .map((item) => {
      return pluginImportStatement.get(item)
    })
    .reduce((total, next) => total + next, '')
  console.log(options)
  return Promise.resolve()
}

export default createProjectQuestions
