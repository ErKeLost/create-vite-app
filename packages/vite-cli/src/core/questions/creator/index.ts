import { prompt, QuestionCollection } from 'inquirer'
import options from '../../../shared/options'
import precss from './precss'
import components from './components'
import PackageDevice from './packageDevice'
import Plugins from './plugins'
import future from './feature'
import device from './device'
import { componentsMap, futureMap } from './ejsMapConstant'
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
  // 包管理器版本
  await createQuestion(prompts, PackageDevice)
  // 新特性 新预设
  await createQuestion(prompts, future)
  // pc or mobile
  await createQuestion(prompts, device)
  // ui library
  await createQuestion(prompts, components)
  // vite plugins
  await createQuestion(prompts, Plugins)
  await createQuestion(prompts, precss)
  // options 对象属性 所有 属性
  // 获取 选中 components
  // console.log(componentsMap.get(options.components))
  const currentLibrary = componentsMap.get(options.components)
  const Eslint = futureMap.get('Eslint')
  const Prettier = futureMap.get('Prettier')
  console.log(Eslint)
  console.log(Prettier)

  // 获取整个map
  // console.log(componentsMap, 'map')
  // map 转 对象
  // const res = strMapToObj(componentsMap)
  // console.log(res)
  // 合并 map 对象
  // console.log(Object.assign(options, res), '合并map对象')
  options.ui = currentLibrary
  options.Eslint = Eslint
  options.Prettier = Prettier
  console.log(options)

  return Promise.resolve()
}

export default createProjectQuestions
function strMapToObj(strMap) {
  const obj = Object.create(null) //创建空的对象
  for (const [k, v] of strMap) {
    obj[k] = v
  }
  return obj
}
