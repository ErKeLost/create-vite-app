import { cloneDeep } from 'lodash-es'
import { themeSetting } from '@/settings'
import { handleModuleRoutes } from '@/utils/router/modules'
import buildFile from '@/settings/companyConfig'
const arr = handleModuleRoutes(buildFile)
const buildSetting = arr.filter((item) => {
  // console.log(item.name)
  // console.log(import.meta.env.VITE_BUILD_NAME)

  return item.name === import.meta.env.VITE_BUILD_NAME
})
// console.log(buildSetting)
// console.log(themeSetting)

/** 获取主题配置 */
export function getThemeSettings() {
  const setting = cloneDeep({ ...buildSetting[0] })
  return setting
}
