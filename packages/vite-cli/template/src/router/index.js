'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const vue_router_1 = require('vue-router');
const virtual_generated_layouts_1 = require('virtual:generated-layouts');
const virtual_generated_pages_1 = require('virtual:generated-pages');
const routes = (0, virtual_generated_layouts_1.setupLayouts)(
  virtual_generated_pages_1.default,
);
const router = (0, vue_router_1.createRouter)({
  history: (0, vue_router_1.createWebHashHistory)(),
  routes,
});
exports.default = router;
