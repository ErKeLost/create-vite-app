/* 动态改变element-plus主题色 */
import epCss from './element.scss'
import { convert } from 'css-color-function'
import { HexToRGBA, RGBAtoHex } from '@erkelost/utils'
// 色值表
const formula: any = {
  'shade-1': 'color(primary shade(10%))',
  'light-1': 'color(primary tint(10%))',
  'light-2': 'color(primary tint(20%))',
  'light-3': 'color(primary tint(30%))',
  'light-4': 'color(primary tint(40%))',
  'light-5': 'color(primary tint(50%))',
  'light-6': 'color(primary tint(60%))',
  'light-7': 'color(primary tint(70%))',
  'light-8': 'color(primary tint(80%))',
  'light-9': 'color(primary tint(90%))'
}

// 把生成的样式表写入到style中
export const writeNewStyle = (newStyle: string): void => {
  const style = window.document.createElement('style')
  style.innerText = newStyle
  window.document.head.appendChild(style)
}

// 根据主题色，生成最新的样式表
export const createNewStyle = (
  primaryStyle: Record<string, any>
): Record<string, any> => {
  // 根据主色生成色值表
  const colors = createColors(primaryStyle)
  // 在当前ep的默认样式表中标记需要替换的色值
  let cssText = getStyleTemplate(epCss)
  // 遍历生成的色值表，在 默认样式表 进行全局替换
  Object.keys(colors).forEach((key) => {
    cssText = cssText.replace(
      new RegExp('(:|\\s+)' + key, 'g'),
      '$1' + colors[key]
    )
  })
  return cssText
}

export const createColors = (
  primary: Record<string, any>
): Record<string, any> => {
  if (!primary) return {}
  const colors: any = {
    primary
  }
  Object.keys(formula).forEach((key) => {
    const value = formula[key].replace(/primary/, primary)
    const valueColorArr = convert(value)
      .replace(/\'/g, '')
      .match(/(?<=\().*(?=\))/g)[0]
      .split(',')
    const valueColorObj = {
      r: valueColorArr[0],
      g: valueColorArr[1],
      b: valueColorArr[2],
      a: 1
    }
    colors[key] = RGBAtoHex(valueColorObj)
  })
  return colors
}

const getStyleTemplate = (data: any): Record<string, any> => {
  const colorMap: any = {
    '#3a8ee6': 'shade-1',
    '#409eff': 'primary',
    '#53a8ff': 'light-1',
    '#66b1ff': 'light-2',
    '#79bbff': 'light-3',
    '#8cc5ff': 'light-4',
    '#a0cfff': 'light-5',
    '#b3d8ff': 'light-6',
    '#c6e2ff': 'light-7',
    '#d9ecff': 'light-8',
    '#ecf5ff': 'light-9'
  }
  Object.keys(colorMap).forEach((key) => {
    const value = colorMap[key]
    data = data.replace(new RegExp(key, 'ig'), value)
  })
  return data
}

// 自动计算hover和active颜色 https://element-plus.gitee.io/zh-CN/component/button.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A2%9C%E8%89%B2-%E6%B5%8B%E8%AF%95%E7%89%88
export const shadeBgColor = (color: string): string => {
  const obj = HexToRGBA(color)
  return `rgb(${obj.r},${obj.g},${obj.b})`
}
