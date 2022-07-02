#!/usr/bin/env node
import program from './core/program'
import viteCliCoreCommand from './core/command'
async function createViteCliCommand() {
  await viteCliCoreCommand()
  program.parse(process.argv)
}

createViteCliCommand()
