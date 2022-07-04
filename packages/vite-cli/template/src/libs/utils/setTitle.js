'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function setTitle(title) {
  const { VITE_APP_TITLE } = import.meta.env;
  const processTitle = VITE_APP_TITLE || 'X-BUILD';
  window.document.title = `${title ? `${title} | ` : ''} ${processTitle}`;
}
exports.default = setTitle;
