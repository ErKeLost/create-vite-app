interface Options {
  useTheme?: boolean
  templatePath?: string
  Router?: string
  Pinia?: string
  Eslint?: string
  Prettier?: string
  name?: string
  version?: string
  src?: string
  dest?: string
  components?: string
  pluginType?: 'component' | 'hook' | 'directive'
  plugins?: string[]
  allPackages?: any[]
  precss?: 'less' | 'scss' | ''
  package?: 'pnpm' | 'npm' | 'yarn'
  ui?: any
  useEslint?: boolean
  usePrettier?: boolean
  useRouter?: boolean
  usePinia?: boolean
  EslintScript?: string
  PrettierScript?: string
  EslintWithPrettierScript?: string
  pluginList?: string
  frame?: string
  pluginImportStatement?: string
  // vue-components-import
  ComponentResolver?: any
  notComponentResolver?: boolean
}

const options: Options = {
  plugins: [],
  precss: '',
  useTheme: false
}
export default options
