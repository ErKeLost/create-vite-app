"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const log_1 = require("../utils/log");
async function default_1(name) {
    // access 操作文件异步执行所有操作 不会阻塞事件循环 完成或者 错误时调用回调函数
    // name 为指定目录 或者 文件 没有 返回null
    try {
        await (0, promises_1.access)(name, fs_1.constants.R_OK | fs_1.constants.W_OK);
        (0, log_1.red)(`The ${name} folder already exists in the current directory. Please try to use another project name!`);
        process.exit(1);
    }
    catch (_a) {
        return true;
    }
}
exports.default = default_1;
