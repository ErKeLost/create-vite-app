"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const version_1 = require("./version");
const help_1 = require("./help");
const create_1 = require("./create");
function viteCliCoreCommand() {
    (0, help_1.default)();
    (0, version_1.default)();
    (0, create_1.default)();
}
exports.default = viteCliCoreCommand;
