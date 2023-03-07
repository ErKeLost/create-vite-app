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
  package?: 'pnpm' | 'npm' | 'yarn' | 'none'
  ui?: any
  useEslint?: boolean
  usePrettier?: boolean
  useRouter?: boolean
  usePinia?: boolean
  EslintScript?: string
  PrettierScript?: string
  EslintWithPrettierScript?: string
  constantDevDeps?: string
  constantProDeps?: string
  pluginList?: string
  frame?: string
  pluginImportStatement?: string
  // vue-components-import
  ComponentResolver?: unknown
  notComponentResolver?: boolean
  vuetify?: boolean
  varlet?: boolean
  elementPlus?: boolean
}

const options: Options = {
  plugins: [],
  precss: '',
  useTheme: false
}
export default options
