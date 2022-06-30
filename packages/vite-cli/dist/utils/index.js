"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicCatchError = exports.getOriginPackageJson = exports.compose = exports.getProjectPath = exports.taskPre = exports.runAsync = exports.runSync = exports.DefaultLogger = void 0;
const child_process_1 = require("child_process");
const chalk_1 = require("chalk");
const path_1 = require("path");
const fs_1 = require("fs");
const ora_1 = require("ora");
const util_1 = require("util");
const execSync = child_process_1.default.execSync;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = util_1.default.promisify(require('child_process').exec);
class DefaultLogger {
    constructor(startText) {
        this._spinner = (0, ora_1.default)(startText).start();
    }
    log(text, color) {
        if (color) {
            this._spinner.color = color;
        }
        this._spinner.text = text;
    }
    succeed(text) {
        this._spinner.succeed(text);
    }
    fail(text) {
        this._spinner.fail(text);
    }
}
exports.DefaultLogger = DefaultLogger;
const runSync = (command, spinner) => {
    try {
        return execSync(command, { cwd: process.cwd(), encoding: 'utf8' });
    }
    catch (error) {
        spinner.fail('task fail');
        process.exit(1);
    }
};
exports.runSync = runSync;
const runAsync = async (command, spinner) => {
    try {
        await exec(command, { cwd: process.cwd(), encoding: 'utf8' });
    }
    catch (error) {
        spinner.fail('task fail');
        process.exit(1);
    }
};
exports.runAsync = runAsync;
const taskPre = (logInfo, type) => {
    if (type === 'start') {
        return `task start(开始任务): ${logInfo} \r\n`;
    }
    else {
        return `task end(任务结束): ${logInfo} \r\n`;
    }
};
exports.taskPre = taskPre;
// 获取项目文件
const getProjectPath = (dir = './') => {
    return path_1.default.join(process.cwd(), dir);
};
exports.getProjectPath = getProjectPath;
function compose(middleware) {
    const otherOptions = {};
    function dispatch(index, otherOptions) {
        if (index == middleware.length)
            return;
        const currMiddleware = middleware[index];
        currMiddleware((addOptions) => {
            dispatch(++index, { ...otherOptions, ...addOptions });
        }, otherOptions).catch((error) => {
            console.log('💣 发布失败，失败原因：', error);
        });
    }
    dispatch(0, otherOptions);
}
exports.compose = compose;
/**
 * 获取当前package.json的版本号
 */
const getOriginPackageJson = () => {
    const packageJson = JSON.parse(fs_1.default.readFileSync((0, exports.getProjectPath)('package.json'), 'utf-8'));
    return packageJson;
};
exports.getOriginPackageJson = getOriginPackageJson;
/**
 * 工具函数，用来捕获并打印错误，返回false
 */
const basicCatchError = (err) => {
    console.log(`\r\n ${chalk_1.default.red(err)}`);
    return false;
};
exports.basicCatchError = basicCatchError;
