"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILD_DATE = exports.VERSION = exports.VALUE_ONLINE = exports.JZZX_NAME = exports.JZZX_VERSION = exports.PKG = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const figlet = require('figlet');
// import figlet from 'figlet'
// eslint-disable-next-line @typescript-eslint/no-var-requires
exports.PKG = require('../../package.json');
exports.JZZX_VERSION = exports.PKG.version;
exports.JZZX_NAME = exports.PKG.name;
exports.VALUE_ONLINE = '\r\n' +
    figlet.textSync('VITE CLI', {
        font: '3D-ASCII',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 200,
        whitespaceBreak: true
    });
exports.VERSION = `\n\t\t\t🌱🌱Published${exports.PKG.version}Build @ VITE-CLI.com`;
exports.BUILD_DATE = `\n\t\t\t🌱🌱Build date: ${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}-VITE-CLI`;
