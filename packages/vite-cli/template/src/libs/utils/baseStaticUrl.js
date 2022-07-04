'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// 处理静态资源链接
function baseStaticUrl(src = '') {
  const { VITE_APP_STATIC_URL } = import.meta.env;
  if (src) {
    return `${VITE_APP_STATIC_URL}${src}`;
  }
  return VITE_APP_STATIC_URL;
}
exports.default = baseStaticUrl;
