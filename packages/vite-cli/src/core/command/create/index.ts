import program from '../../program'
import createProject from './createProject'
export default async function createCommand() {
  program
    .description('init Vue3 + Vite3 + Typescript project   📑  📑')
    .action(async () => {
      createProject()
    })
}
