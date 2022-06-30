const chooseFileType = {
  name: 'fileType',
  type: 'list',
  message: '请选择创建文件类型',
  choices: [
    { name: 'JavaScript', value: 'js' },
    { name: 'TypeScript', value: 'ts' },
    { name: 'Tsx', value: 'tsx' }
  ]
}
const chooseComponentFile = {
  name: 'componentType',
  type: 'list',
  message: '请选择创建component类型',
  choices: [
    { name: 'vue', value: 'vue' },
    { name: 'jsx', value: 'jsx' },
    { name: 'tsx', value: 'tsx' }
  ]
}
export { chooseFileType, chooseComponentFile }
