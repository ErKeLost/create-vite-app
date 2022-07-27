import program from '../../program'
import emptyDirName from '../../../utils/emptyDirName'
import createProject from './createProject'
export default async function createCommand() {
  program
    // .command('create <project-name>')
    .command('create')
    .description('init Vue3 + Vite3 + Typescript project   📑  📑')
    .action(async () => {
      // await emptyDirName(name)
      createProject()
    })
}
