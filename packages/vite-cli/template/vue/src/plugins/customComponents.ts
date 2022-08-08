import { App } from 'vue'
import AdnyLayout from '@erkelost/layout'
import { ColorPicker } from '@erkelost/colorpicker'
import { Statistic } from '@erkelost/statistic'
/**
 * 全局注册自定义组件 待完善
 * @param app
 */
const registerComponents = [AdnyLayout, ColorPicker, Statistic]
export function setupCustomComponents(app: App) {
  registerComponents.forEach((component) => {
    app.component(component.name, component)
  })
}
