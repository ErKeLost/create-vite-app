import { magenta as color } from 'chalk'
import program from '../../program'
import { magenta } from '../../../utils/log'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const gradient = require('gradient-string')
import {
  VALUE_ONLINE,
  VERSION,
  VITE_CLI_VERSION,
  BUILD_DATE
} from '../../../shared/constant'
import createSpawnCmd from '@/utils/createSpawnCmd'
const createVersionCommand = async () => {
  program
    .version(color(VITE_CLI_VERSION), '-v --version')
    .usage('<command> [options]')
    .action(() => {
      magenta(gradient.atlas(VALUE_ONLINE))
      magenta(VERSION)
      magenta(BUILD_DATE)
    })
  const dest = path.resolve(process.cwd())
  const cmdInherit = createSpawnCmd(dest, 'inherit')
  // await cmdInherit('vite create asd')
}
export default createVersionCommand
