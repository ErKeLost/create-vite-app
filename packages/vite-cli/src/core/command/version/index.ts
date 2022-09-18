import program from '../../program'
import { magenta } from '../../../utils/log'
// eslint-disable-next-line @typescript-eslint/no-var-requires
import {
  VERSION,
  VITE_CLI_VERSION,
  BUILD_DATE
} from '../../../shared/constant'
function getVersionView() {
  magenta(VITE_CLI_VERSION)
  // magenta(gradient.atlas(VALUE_ONLINE))
  magenta(VERSION)
  magenta(BUILD_DATE)
  return ''
}
const createVersionCommand = async () => {
  program
    .version(getVersionView(), '-v --version')
    .usage('<command> [options]')
    .action(() => {
      // magenta(gradient.atlas(VALUE_ONLINE))
      magenta(VERSION)
      magenta(BUILD_DATE)
    })
}
export default createVersionCommand
