import program from '../../program'
import emptyDirName from '../../../utils/emptyDirName'
import createProject from './createProject'
export default async function createCommand() {
  program
    .command('create <project-name>')
    .description('init Vue3 + Vite3 + Typescript project   📑  📑')
    .action(async (name) => {
      await emptyDirName(name)
      createProject(name)
    })
}
