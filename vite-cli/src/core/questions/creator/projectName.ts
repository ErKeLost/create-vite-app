import options from '../../../compile/vue/options'
import emptyDirName from '../../../utils/emptyDirName'
const defaultProjectName = 'project-name'

const packageName = [
  {
    name: 'projectName',
    type: 'text',
    message: 'Project Name ?',
    initial: defaultProjectName,
    onState: (state) => {
      options.name = state.value
    },
    active: 'Yes',
    inactive: 'No'
  },
  {
    name: 'overwrite',
    type: () => (emptyDirName(options.name) ? null : 'confirm'),
    message: () => {
      return `🚨🚨 files "${options.name}" is not empty. Remove existing files and continue?`
    }
  },
  {
    name: 'overwrite',
    type: (prev, values) => {
      if (values.overwrite === false) {
        throw new Error(' Operation cancelled')
      }
      return null
    }
  }
]
export default packageName
