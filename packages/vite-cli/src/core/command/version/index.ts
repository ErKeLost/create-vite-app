import program from '../../program'
import { magenta } from '../../../utils/log'
import {
  VERSION,
  VITE_CLI_VERSION,
  BUILD_DATE
} from '../../../shared/constant'
function getVersionView() {
  magenta(VITE_CLI_VERSION)
  magenta(VERSION)
  magenta(BUILD_DATE)
  return ''
}
const createVersionCommand = async () => {
  program
    .version(getVersionView(), '-v --version')
    .usage('<command> [options]')
    .action(() => {
      magenta(VERSION)
      magenta(BUILD_DATE)
    })
}
export default createVersionCommand
