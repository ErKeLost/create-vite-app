const future = [
  {
    name: 'useRouter',
    type: () => 'toggle',
    message: 'Add Vue Router for Single Page Application development?',
    initial: false,
    active: 'Yes',
    inactive: 'No'
  },
  {
    name: 'usePinia',
    type: () => 'toggle',
    message: 'Add Pinia for state management?',
    initial: false,
    active: 'Yes',
    inactive: 'No'
  },
  {
    name: 'useEslint',
    type: () => 'toggle',
    message: 'Add ESLint for code quality?',
    initial: false,
    active: 'Yes',
    inactive: 'No'
  },
  {
    name: 'usePrettier',
    type: () => 'toggle',
    message: 'Add Prettier for code formatting?',
    initial: false,
    active: 'Yes',
    inactive: 'No'
  }
]
export default future
