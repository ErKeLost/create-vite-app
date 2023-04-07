import { App } from 'vue'
/**
 * @param app
 */
function getDictData(code: string) {
  // example such as dictData
  // return dictCodeData.value.filter((item: any) => item.code_no === code)
}
const globalMethodsArr = [
  {
    sign: 'getDictData',
    res: getDictData
  }
]
export function setupGlobalMethods(app: App) {
  globalMethodsArr.forEach((item) => {
    app.config.globalProperties[item.sign] = item.res
  })
}
