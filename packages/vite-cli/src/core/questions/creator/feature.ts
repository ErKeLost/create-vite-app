const future = [
  {
    name: 'Router',
    type: () => 'toggle',
    message: 'Add Vue Router for Single Page Application development?',
    initial: false,
    active: 'Yes',
    inactive: 'No'
  },
  {
    name: 'Pinia',
    type: () => 'toggle',
    message: 'Add Pinia for state management?',
    initial: false,
    active: 'Yes',
    inactive: 'No'
  },
  {
    name: 'needsEslint',
    type: () => 'toggle',
    message: 'Add ESLint for code quality?',
    initial: false,
    active: 'Yes',
    inactive: 'No'
  },
  {
    name: 'needsPrettier',
    type: () => 'toggle',
    message: 'Add Prettier for code formatting?',
    initial: false,
    active: 'Yes',
    inactive: 'No'
  }
]
export default future
