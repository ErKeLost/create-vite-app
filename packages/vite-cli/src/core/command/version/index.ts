import { magenta as color } from 'chalk'

import program from '../../program'

import { magenta } from '../../../utils/log'
import {
  VALUE_ONLINE,
  VERSION,
  VITE_CLI_VERSION,
  BUILD_DATE
} from '../../../shared/constant'
const createVersionCommand = () => {
  program
    .version(color(VITE_CLI_VERSION), '-v --version')
    .usage('<command> [options]')
    .action(() => {
      magenta(VALUE_ONLINE)
      magenta(VERSION)
      magenta(BUILD_DATE)
    })
}
export default createVersionCommand
