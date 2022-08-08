import prompts from 'prompts'
import precss from './precss'
import components from './components'
import Plugins from './plugins'
import future from './feature'
import theme from './theme'
import options from '@/shared/options'
import {
  componentsMap,
  futureMap,
  lintMap,
  pluginMap,
  pluginImportStatement,
  componentResolverMap
} from '@/shared/vueEjsMapConstant'
import createQuestion from '@/utils/question'
async function getVueProperty() {
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
  // options assign
  await getVueProperty()
}
