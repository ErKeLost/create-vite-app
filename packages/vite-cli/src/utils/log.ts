// import {
//   // red as redColor,
//   // green as greenColor,
//   // yellow as yellowColor,
//   // gray as grayColor,
//   // blue as blueColor,
//   // black as blackColor,
//   // magenta as magentaColor,
//   // cyan as cyanColor,
//   bgGreen as bgGreenColor,
//   bgRed as bgRedColor,
//   bgYellow as bgYellowColor,
//   bgGray as bgGrayColor,
//   bgBlue as bgBlueColor,
//   bgMagenta as bgMagentaColor,
//   bgCyan as bgCyanColor
// } from 'chalk'
import {
  red as redColor,
  green as greenColor,
  yellow as yellowColor,
  gray as grayColor,
  blue as blueColor,
  black as blackColor,
  magenta as magentaColor,
  cyan as cyanColor
} from 'kolorist'
export const red = (args: string | number) => console.log(redColor(args))
export const green = (res: string | number) => console.log(greenColor(res))
export const gray = (res: string | number) => console.log(grayColor(res))
export const yellow = (res: string | number) => console.log(yellowColor(res))
export const blue = (res: string | number) => console.log(blueColor(res))
export const magenta = (res: string | number) => console.log(magentaColor(res))
export const black = (res: string | number) => console.log(blackColor(res))
export const cyan = (res: string | number) => console.log(cyanColor(res))
// export const bgGreen = (res: unknown) => console.log(bgGreenColor(res))
// export const bgRed = (res: unknown) => console.log(bgRedColor(res))
// export const bgYellow = (res: unknown) => console.log(bgYellowColor(res))
// export const bgGray = (res: unknown) => console.log(bgGrayColor(res))
// export const bgBlue = (res: unknown) => console.log(bgBlueColor(res))
// export const bgMagenta = (res: unknown) => console.log(bgMagentaColor(res))
// export const bgCyan = (...res: unknown[]) => console.log(bgCyanColor(...res))

export const complete = (name, dest, type, description) => {
  green(`\n ${description}`)
  cyan(`\n To get started with into "${name}.${type}"`)
  console.log(`\n cd ${dest} \n`)
}
