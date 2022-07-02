#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("./core/program");
const command_1 = require("./core/command");
async function createViteCliCommand() {
    await (0, command_1.default)();
    program_1.default.parse(process.argv);
}
createViteCliCommand();
