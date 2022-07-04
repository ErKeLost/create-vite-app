'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const request_1 = require('@/libs/request');
function default_1() {
  return (0, request_1.default)({
    method: 'get',
    url: '/api',
  });
}
exports.default = default_1;
