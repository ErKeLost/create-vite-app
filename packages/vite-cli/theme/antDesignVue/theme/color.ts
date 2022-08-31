const themeColors: any = {
  default: {
    color: '#409EFF',
    subMenuActiveText: '#fff',
    menuBg: 'red',
    menuHover: '#4091f7',
    subMenuBg: '#0f0303',
    subMenuActiveBg: '#ffbbaa',
    navTextColor: '#fff',
    menuText: 'rgb(254 254 254 / 65%)',
    sidebarLogo: '#002140',
    menuTitleHover: '#fff',
    menuActiveBefore: '#4091f7'
  }
}

type MultipleScopeVarsItem = {
  scopeName: string
  path: string
  varsContent: string
}

export function genScssMultipleScopeVars(): MultipleScopeVarsItem[] {
  const result = [] as MultipleScopeVarsItem[]
  Object.keys(themeColors).forEach((key) => {
    result.push({
      scopeName: `layout-theme-${key}`,
      varsContent: `$primary-color: ${themeColors[key].color} !default;$vxe-primary-color: $primary-color;$subMenuActiveText: ${themeColors[key].subMenuActiveText} !default;$menuBg: ${themeColors[key].menuBg} !default;$menuHover: ${themeColors[key].menuHover} !default;$subMenuBg: ${themeColors[key].subMenuBg} !default;$subMenuActiveBg: ${themeColors[key].subMenuActiveBg} !default;$navTextColor: ${themeColors[key].navTextColor} !default;$menuText: ${themeColors[key].menuText} !default;$sidebarLogo: ${themeColors[key].sidebarLogo} !default;$menuTitleHover: ${themeColors[key].menuTitleHover} !default;$menuActiveBefore: ${themeColors[key].menuActiveBefore} !default;`
    } as MultipleScopeVarsItem)
  })
  return result
}
