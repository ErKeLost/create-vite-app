// import { magenta as color } from 'chalk'
import program from '../../program'
import { magenta } from '../../../utils/log'
// eslint-disable-next-line @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
const gradient = require('gradient-string')
import {
  VALUE_ONLINE,
  VERSION,
  VITE_CLI_VERSION,
  BUILD_DATE
} from '../../../shared/constant'
function getVersionView() {
  magenta(VITE_CLI_VERSION)
  magenta(gradient.atlas(VALUE_ONLINE))
  magenta(VERSION)
  magenta(BUILD_DATE)
  return ''
}
const createVersionCommand = async () => {
  program
    .version(getVersionView(), '-v --version')
    .usage('<command> [options]')
    .action(() => {
      magenta(gradient.atlas(VALUE_ONLINE))
      magenta(VERSION)
      magenta(BUILD_DATE)
    })
}
export default createVersionCommand
