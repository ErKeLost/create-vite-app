import options from '@/shared/options'
import emptyDirName from '@/utils/emptyDirName'
const defaultProjectName = 'project-name'

const packageName = [
  {
    name: 'projectName',
    type: 'text',
    message: 'Project name:',
    initial: defaultProjectName,
    onState: (state) => {
      options.name = state.value
    },
    active: 'Yes',
    inactive: 'No'
  },
  {
    name: 'overwrite',
    type: async () => ((await emptyDirName(options.name)) ? null : 'toggle'),
    initial: false,
    message: async () => {
      return `🚨🚨 files "${options.name}" is not empty. Remove existing files and continue?`
    }
  },
  {
    name: 'overwrite',
    type: (prev, values) => {
      if (values.shouldOverwrite === false) {
        throw new Error(' Operation cancelled')
      }
      return null
    }
  }
]
export default packageName
