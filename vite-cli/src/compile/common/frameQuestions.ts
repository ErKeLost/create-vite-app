import { runVueQuestions } from '@/core/questions/vue'
import { runReactQuestions } from '@/core/questions/react'
import { readdirSync } from 'fs'
import options from '@/compile/vue/options'
import fs = require('fs-extra')
const frameQuestions = new Map()
const filterQuestions = new Map()
frameQuestions.set('vue', runVueQuestions)
frameQuestions.set('react', runReactQuestions)
// filterQuestions.set('vue', runFilterQuestions)
export function getFilterFile() {
  // 修复 frame work bug
  const assets = readdirSync(
    `${__dirname}/template/${options.frame}/src/assets`
  ).filter((item) => !item.includes('logo'))
  async function vueFilterFileActions() {
    const res = assets.filter(
      (item) => item.split('.')[0] !== options.components
    )
    res.forEach((item) => {
      fs.remove(`${options.dest}/src/assets/${item}`)
    })
    if (!options.useRouter) {
      fs.remove(`${options.dest}/src/router`)
    }
    if (!options.usePinia) {
      fs.remove(`${options.dest}/src/store`)
    }
    if (!options.usePrettier) {
      fs.remove(`${options.dest}/.prettierrc.js`)
    }

    if (!options.useEslint) {
      fs.remove(`${options.dest}/.eslintrc.js`)
      // fs.remove(`${options.dest}/.eslintrc.ejs`)
    }
    if (!options.plugins.includes('html')) {
      fs.remove(`${options.dest}/build/vite/html.ts`)
    }
    if (!options.plugins.includes('unocss')) {
      fs.remove(`${options.dest}/unocss.config.ts`)
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
