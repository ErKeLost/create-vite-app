import * as fs from 'fs'

import { postOrderDirectoryTraverse } from './directoryTraverse'

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }

  postOrderDirectoryTraverse(
    dir,
    (dir) => fs.rmdirSync(dir),
    (file) => fs.unlinkSync(file)
  )
}
export default emptyDir
