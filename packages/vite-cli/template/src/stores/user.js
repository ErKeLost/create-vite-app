'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.useUserStore = void 0;
const pinia_1 = require('pinia');
const store_1 = require('store');
const router_1 = require('@/router');
const ua_parser_js_1 = require('ua-parser-js');
const defaultUserInfo = {
  id: '',
  token: '',
  name: '',
  avatar: '',
  roles: [],
};
exports.useUserStore = (0, pinia_1.defineStore)({
  id: 'PageExample',
  state: () => ({
    userInfo: { ...defaultUserInfo },
    ua: new ua_parser_js_1.default().getResult(),
  }),
  actions: {
    setUserInfo(payload) {
      this.userInfo = payload;
      store_1.default.set('USER_ID', payload.id);
      store_1.default.set('ACCESS_TOKEN', payload.token);
    },
    resetUserInfo() {
      this.userInfo = { ...defaultUserInfo };
    },
    async getUserInfo() {
      const userID = store_1.default.get('USER_ID');
      if (!userID) {
        // 异步调用查询用户信息接口
      }
    },
    async login() {
      // 调用登陆接口
      // this.setUserInfo(payload);
      // router.push({ path: '/' });
    },
    async logout() {
      // 调用退出登陆接口
      this.resetUserInfo();
      router_1.default.push({ name: 'Login' });
    },
    async verification(token) {
      // 调用 token 验证接口
      return Promise.resolve(token);
    },
  },
});
