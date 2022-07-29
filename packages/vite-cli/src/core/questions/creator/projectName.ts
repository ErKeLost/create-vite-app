import options from '@/shared/options'
import emptyDirName from '@/utils/emptyDirName'
import { red } from '@/utils/log'
const defaultProjectName = 'project-name'

const packageName = [
  {
    name: 'projectName',
    type: 'text',
    message: 'Project name:',
    initial: defaultProjectName,
    onState: (state) => {
      options.name = state.value
    }
  },
  {
    name: 'shouldOverwrite',
    type: async () => ((await emptyDirName(options.name)) ? null : 'toggle'),
    initial: false,
    message: async () => {
      return `🚨🚨 files "${options.name}" is not empty. Remove existing files and continue?`
    }
  },
  {
    name: 'shouldOverwrite',
    type: (prev, values) => {
      console.log(values.shouldOverwrite)
      if (values.shouldOverwrite === false) {
        throw new Error(red('✖') + ' Operation cancelled')
      }
      return null
    }
  }
]
export default packageName
