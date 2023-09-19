import { showToast } from 'vant';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export const _fetch = axios.create({
  timeout: 60000,
  baseURL: '/api/v1',
});

_fetch.interceptors.request.use(
  function (config) {
    // 客户端请求客户端服务需携带electronKey
    const token = sessionStorage.getItem('token');
    config.headers['token'] = token;
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.resolve({
      code: error.code || 400,
      data: null,
      success: false,
      msg: error.message,
    });
  },
);

// 添加响应拦截器
_fetch.interceptors.response.use(
  function (res) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (res.status !== 200 || res.data?.code !== 0) {
      showToast(res.data?.msg || '请求错误！');
      return {
        code: res.data?.code || res.status || 500,
        success: false,
        msg: res.data?.msg || 'unknow error',
      };
    }
    return { ...res.data, success: true };
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (error?.response?.status === 401 && location.pathname !== '/login') {
      showToast({
        message: '未登录，即将前往登录',
        onClose() {
          location.href = '/login';
        },
      });
    } else {
      console.log(error);

      showToast(error?.response?.data?.msg || '请求错误！');
    }
    return Promise.resolve({
      code: error.code || 500,
      data: null,
      success: false,
      msg: error?.response?.data?.msg || '请求错误！',
    });
  },
);

interface Response<T> {
  code: number;
  success: boolean;
  msg: string;
  data: T;
}

export const fetch = {
  post: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<Response<T>> => {
    return await _fetch.post(url, data, config);
  },
  put: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<Response<T>> => {
    return await _fetch.put(url, data, config);
  },
  delete: async <T>(
    url: string,
    config?: AxiosRequestConfig<any> | undefined,
  ): Promise<Response<T>> => {
    return await _fetch.delete(url, config);
  },
};
