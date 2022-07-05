interface Options {
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
