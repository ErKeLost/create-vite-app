'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const store_1 = require('store');
const nprogress_1 = require('nprogress');
const router_1 = require('@/router');
const user_1 = require('@/stores/user');
const utils_1 = require('@/libs/utils');
// 进度条
require('nprogress/nprogress.css');
const loginRoutePath = '/user/login';
const defaultRoutePath = '/home';
/**
 * 路由拦截
 * 权限验证
 */
router_1.default.beforeEach(async (to, from, next) => {
  const userStore = (0, user_1.useUserStore)();
  const token = store_1.default.get('ACCESS_TOKEN');
  // 进度条
  nprogress_1.default.start();
  // 验证当前路由所有的匹配中是否需要有登录验证的
  if (to.matched.some((r) => r.meta.auth)) {
    // 是否存有token作为验证是否登录的条件
    if (token && token !== 'undefined') {
      if (to.path === loginRoutePath) {
        next({ path: defaultRoutePath });
      } else {
        next();
      }
    } else {
      // 没有登录的时候跳转到登录界面
      // 携带上登录成功之后需要跳转的页面完整路径
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath,
        },
      });
      nprogress_1.default.done();
    }
  } else {
    // 不需要身份校验 直接通过
    next();
  }
});
router_1.default.afterEach((to) => {
  // 进度条
  nprogress_1.default.done();
  (0, utils_1.setTitle)(to.meta.title);
});
