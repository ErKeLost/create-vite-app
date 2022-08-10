const templateFilesMap = new Map()
templateFilesMap.set('vue', vueFetchTemplateFiles)
templateFilesMap.set('react', vueFetchTemplateFiles)
export function vueFetchTemplateFiles(): string[] {
  return [
    'package.json',
    'vite.config.ts',
    'src/main.ts',
    'build/vite/plugin.ts',
    'src/plugins/customComponents.ts',
    'src/components/Welcome.vue',
    'src/components/HelloWorld.vue',
    'src/App.vue',
    'src/plugins/assets.ts',
    'src/store/modules/counter.ts',
    '.eslintrc.js',
    'index.html'
  ]
}
export { templateFilesMap }
