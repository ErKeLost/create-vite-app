'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function baseApiUrl(port) {
  const { VITE_APP_BASE_URL } = import.meta.env;
  if (port) {
    return `${VITE_APP_BASE_URL}:${port}`;
  }
  return VITE_APP_BASE_URL;
}
exports.default = baseApiUrl;
