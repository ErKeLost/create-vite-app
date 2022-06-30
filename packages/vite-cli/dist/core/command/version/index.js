"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const program_1 = require("../../program");
const log_1 = require("../../../utils/log");
const constant_1 = require("../../../shared/constant");
const createVersionCommand = () => {
    program_1.default
        .version((0, chalk_1.magenta)(constant_1.JZZX_VERSION), '-v --version')
        .usage('<command> [options]')
        .action(() => {
        (0, log_1.magenta)(constant_1.VALUE_ONLINE);
        (0, log_1.magenta)(constant_1.VERSION);
        (0, log_1.magenta)(constant_1.BUILD_DATE);
    });
};
exports.default = createVersionCommand;
