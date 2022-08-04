import { runVueQuestions } from '@/core/questions/vue'
const frameQuestions = new Map()
const filterQuestions = new Map()
frameQuestions.set('vue', runVueQuestions)
// filterQuestions.set('vue', runFilterQuestions)

export { frameQuestions, filterQuestions }
