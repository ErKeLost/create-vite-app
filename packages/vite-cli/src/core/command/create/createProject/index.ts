// import { red } from '../../../../utils/log'
// import path from 'path'
// import fs from 'fs-extra'
// import createProjectQuestions from '../../../questions/createProject'
import clearConsole from '../../../../utils/clearConsole'
import { VITE_CLI_VERSION } from '../../../../shared/constant'
export default function () {
  clearConsole('cyan', `🎨  🎨   VITE_CLI V-${VITE_CLI_VERSION}   🎨  🎨`)
  console.log('创建项目成功')
}
