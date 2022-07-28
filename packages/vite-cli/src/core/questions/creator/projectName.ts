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
    }
  },
  {
    name: 'shouldOverwrite',
    type: async () => ((await emptyDirName(options.name)) ? null : 'confirm'),
    message: async () => {
      return `🚨🚨 files "${options.name}" is not empty. Remove existing files and continue?`
    }
  }
]
export default packageName
