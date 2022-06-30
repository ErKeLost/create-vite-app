"use strict";
/**
 * 执行终端命令
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const commandSpawn = (...args) => {
    return new Promise((resolve, reject) => {
        const childProcess = (0, child_process_1.spawn)(...args);
        childProcess.stdout.pipe(process.stdout);
        childProcess.stderr.pipe(process.stderr);
        childProcess.on('close', () => {
            resolve('done');
        });
    });
};
exports.default = commandSpawn;
