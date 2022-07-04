'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.useRequest = void 0;
const vue_1 = require('vue');
const axios_1 = require('axios');
const store_1 = require('store');
const user_1 = require('@/stores/user');
const { VITE_APP_BASE_URL } = import.meta.env;
const request = axios_1.default.create({
  // API 请求的默认前缀
  baseURL: VITE_APP_BASE_URL,
  timeout: 10000, // 请求超时时间
});
// 异常拦截处理器
const errorHandler = (error) => {
  var _a, _b;
  const status = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status;
  const useStore = (0, user_1.useUserStore)();
  switch (status) {
    /* eslint-disable no-param-reassign */
    case 400:
      error.message = '请求错误';
      break;
    case 401:
      useStore.logout();
      error.message = '未授权，请登录';
      break;
    case 403:
      error.message = '拒绝访问';
      break;
    case 404:
      error.message = `请求地址出错: ${
        (_b = error.response) === null || _b === void 0 ? void 0 : _b.config.url
      }`;
      break;
    case 408:
      error.message = '请求超时';
      break;
    case 500:
      error.message = '服务器内部错误';
      break;
    case 501:
      error.message = '服务未实现';
      break;
    case 502:
      error.message = '网关错误';
      break;
    case 503:
      error.message = '服务不可用';
      break;
    case 504:
      error.message = '网关超时';
      break;
    case 505:
      error.message = 'HTTP版本不受支持';
      break;
    default:
      break;
  }
  return Promise.reject(error);
};
request.interceptors.request.use((config) => {
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  config.headers.Authorization = `Bearer ${store_1.default.get('ACCESS_TOKEN')}`;
  return config;
}, errorHandler);
// response interceptor
request.interceptors.response.use((response) => {
  const dataAxios = response.data;
  const useStore = (0, user_1.useUserStore)();
  // 这个状态码是和后端约定的
  const { code, msg } = dataAxios;
  // 根据 code 进行判断
  if (code === undefined) {
    // 如果没有 code 代表这不是项目后端开发的接口
    return dataAxios;
  }
  // 有 code 代表这是一个后端接口 可以进行进一步的判断
  switch (code) {
    case 0:
      // code === 0 代表没有错误
      return dataAxios.data;
    case 1:
      // code === 1 代表请求错误
      throw Error(msg);
    case 401:
      useStore.logout();
      throw Error(msg);
    default:
      // 不是正确的 code
      return '不是正确的code';
  }
}, errorHandler);
exports.default = request;
function useRequest(axiosConfig, requestConfig) {
  // 最终返回的数据
  const data = (0, vue_1.ref)();
  // 请求失败返回的 Error 对象
  const error = (0, vue_1.ref)();
  // 请求状态
  const loading = (0, vue_1.ref)(false);
  // 立即发送请求
  const immediate =
    (requestConfig === null || requestConfig === void 0
      ? void 0
      : requestConfig.immediate) !== false;
  // 终止请求
  const { CancelToken } = axios_1.default;
  const { token, cancel } = CancelToken.source();
  // 合并求情配置
  const config = { ...axiosConfig, cancelToken: token };
  // 请求 Promise
  function run() {
    loading.value = true;
    return request(config)
      .then((res) => {
        data.value = res;
      })
      .catch((err) => {
        error.value = err;
        if (
          requestConfig === null || requestConfig === void 0
            ? void 0
            : requestConfig.errorMessage
        ) {
          throw Error(requestConfig.errorMessage);
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }
  const content = new Promise((resolve, reject) => {
    if (immediate) {
      run()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
  return { data, error, loading, content, run, cancel };
}
exports.useRequest = useRequest;
