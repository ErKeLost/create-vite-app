"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("../../program");
const emptyDirName_1 = require("../../../utils/emptyDirName");
const createProject_1 = require("./createProject");
async function createCommand() {
    program_1.default
        .command('create <project-name>')
        .description('初始化Vue3 + Vite3 + Typescript 项目 📑📑')
        .action(async (name) => {
        console.log(name);
        await (0, emptyDirName_1.default)(name);
        (0, createProject_1.default)();
    });
}
exports.default = createCommand;
