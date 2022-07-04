'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const vue_1 = require('vue');
const screenfull_1 = require('screenfull');
function useFullscreen() {
  const screenfullActive = (0, vue_1.ref)(false);
  function toggleScreenfull() {
    if (screenfull_1.default.isEnabled) {
      if (screenfull_1.default.isFullscreen) {
        screenfull_1.default.exit();
        screenfullActive.value = false;
      } else {
        screenfull_1.default.request();
        screenfullActive.value = true;
      }
    }
  }
  function openScreenfull() {
    if (screenfull_1.default.isEnabled) {
      screenfull_1.default.request();
      screenfullActive.value = true;
    }
  }
  function closeScreenfull() {
    if (screenfull_1.default.isEnabled) {
      screenfull_1.default.exit();
      screenfullActive.value = false;
    }
  }
  return {
    screenfullActive,
    toggleScreenfull,
    openScreenfull,
    closeScreenfull,
  };
}
exports.default = useFullscreen;
