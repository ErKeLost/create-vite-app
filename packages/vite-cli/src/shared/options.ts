interface Options {
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
  ComponentResolver?: string
}

const options: Options = {}
export default options

export function fetchTemplateFiles(): string[] {
  return [
    'package.json',
    'babel.config.js',
    '.stylelintrc.js',
    'vite.config.ts',
    'src/main.ts'
  ]
}
