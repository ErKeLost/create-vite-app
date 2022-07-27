import options from '@/shared/options'

const defaultProjectName = 'project-name'

export default {
  name: 'projectName',
  type: 'text',
  message: 'Project name:',
  initial: defaultProjectName,
  onState: (state) => {
    options.name = state.value
  }
}
