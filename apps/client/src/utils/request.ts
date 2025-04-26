import type { ResType } from '@/api/index.type';
import store from '@/store';
import { message as Message } from 'antd';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { eventBus } from './event-bus';

const serve = axios.create({
  baseURL: import.meta.env.VITE_APP_baseUrl,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 请求拦截器
serve.interceptors.request.use(
  config => {
    // 如果有token，则在请求头中进行携带,方便进行用户鉴权
    const token = store.getState().client?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    Message.error(error.message);
    return Promise.reject(error);
  }
);

// 响应拦截器
serve.interceptors.response.use(
  response => {
    // 2xx 范围的状态码都会触发该函数。
    const { success, message, data } = response.data as ResType<any>;
    if (success) {
      // 直接返回数据
      console.log('res:', response.data);
      return data;
    } else {
      // 响应成功，但是后端业务逻辑处理失败
      Message.error(message);
      return Promise.reject(message);
    }
  },
  error => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (error.status === 401) {
      eventBus.emit('api-unauthorized', error as AxiosError);
      return;
    }
    const { message } = error.response.data;
    Message.error(message || error.message);
    return Promise.reject(error);
  }
);

/**
 * 请求函数。
 * 如果请求成功会直接返回业务数据data(不包含公共响应如：code,success)，如果请求失败会toast提示错误信息且Promise.reject
 * @param config 请求配置
 * @returns 请求结果
 */
function request<T>(config: AxiosRequestConfig) {
  return serve<T, T>(config);
}

export default request;
