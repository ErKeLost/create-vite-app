'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const vue_1 = require('vue');
const current_device_1 = require('current-device');
function useDevice() {
  const deviceType = (0, vue_1.ref)(current_device_1.default.type);
  const deviceOrientation = (0, vue_1.ref)(current_device_1.default.orientation);
  const deviceOs = (0, vue_1.ref)(current_device_1.default.os);
  return { deviceType, deviceOrientation, deviceOs };
}
exports.default = useDevice;
