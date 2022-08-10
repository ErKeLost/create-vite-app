export * from './theme'
const buildFile = import.meta.globEager('./**/*.ts')

export default buildFile
