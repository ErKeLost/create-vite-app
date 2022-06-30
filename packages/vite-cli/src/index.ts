#!/usr/bin/env node
import program from './core/program'
import viteCliCoreCommand from './core/command'
viteCliCoreCommand()
program.parse(process.argv)
