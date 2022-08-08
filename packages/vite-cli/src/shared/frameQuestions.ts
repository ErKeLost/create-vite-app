import { runVueQuestions } from '@/core/questions/vue'
import { runReactQuestions } from '@/core/questions/react'
import { readdirSync } from 'fs'
import options from '@/shared/options'
import fs = require('fs-extra')
const frameQuestions = new Map()
const filterQuestions = new Map()
frameQuestions.set('vue', runVueQuestions)
frameQuestions.set('react', runReactQuestions)
// filterQuestions.set('vue', runFilterQuestions)
export async function getFilterFile() {
  // 修复 frame work bug
  const assets = readdirSync(
    `${__dirname}/template/${options.frame}/src/assets`
  ).filter((item) => !item.includes('logo'))
  function vueFilterFileActions() {
    const res = assets.filter(
      (item) => item.split('.')[0] !== options.components
    )
    res.forEach((item) => {
      fs.remove(`${options.dest}/src/assets/${item}`)
    })
    if (!options.Router) {
      fs.remove(`${options.dest}/src/router`)
    }
    if (!options.Eslint) {
      fs.remove(`${options.dest}/.prettierrc.js`)
    }
    if (!options.Prettier) {
      fs.remove(`${options.dest}/.eslintrc.js`)
    }
    if (!options.plugins.includes('html')) {
      fs.remove(`${options.dest}/build/vite/html.ts`)
    }
    return true
  }
  function reactFilterQuestion() {
    return true
  }
  const obj = new Map([
    ['vue', vueFilterFileActions],
    ['react', reactFilterQuestion]
  ])
  const res = obj.get(options.frame)
  return res
}
export { frameQuestions, filterQuestions }
