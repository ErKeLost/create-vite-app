import createVersionCommand from './version'
import helpCommand from './help'
import createCommand from './create'
export default function viteCliCoreCommand() {
  helpCommand()
  createVersionCommand()
  createCommand()
}
