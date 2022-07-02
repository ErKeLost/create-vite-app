"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program_1 = require("../../program");
async function helpCommand() {
    program_1.default.option('-d --dest <dest>', 'a destination folder, 例如 -d /src/components 获取对应目标路径 必填项');
    program_1.default.option('-f --framework <framework>', '选择你的框架 例如：-f vue3');
    program_1.default.on('--help', () => {
        console.log('');
        console.log('Other');
        console.log('   otherOptions');
    });
}
exports.default = helpCommand;
