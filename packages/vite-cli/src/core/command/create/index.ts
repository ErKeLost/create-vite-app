import program from '../../program'
import emptyDirName from '../../../utils/emptyDirName'
import createProject from './createProject'
export default async function createCommand() {
  program
    .command('create <project-name>')
    .description('初始化Vue3 + Vite3 + Typescript 项目   📑  📑')
    .action(async (name) => {
      console.log(name)
      await emptyDirName(name)
      createProject(name)
    })
}
