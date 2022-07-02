"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./log");
// import readline from 'readline'
const readline = require('readline');
const constant_1 = require("../shared/constant");
function default_1(color, str) {
    if (process.stdout.isTTY) {
        console.log('');
        const cutLine = ` VITE_CLI ${constant_1.VITE_CLI_VERSION} `;
        (0, log_1.bgCyan)(' ~'.repeat((process.stdout.columns - cutLine.length) / 4) +
            cutLine +
            '~ '.repeat((process.stdout.columns - cutLine.length) / 4));
        const blank = '\n'.repeat(process.stdout.rows);
        console.log(blank);
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
        (0, log_1.cyan)(str);
        console.log('');
    }
}
exports.default = default_1;
