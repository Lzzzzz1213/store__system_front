import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import axios from 'axios';
import { Toast } from 'vant';
import { getAPI } from '@/utils';
import { ServiceResult } from './types';

import {useUserStoreWithOut} from '@/store/modules/user';
function createRequest<T = ServiceResult>(config: AxiosRequestConfig): Promise<T> {
  const userStore = useUserStoreWithOut();
  /**
   * 创建 axios 实例
   */
  const instance: AxiosInstance = axios.create({
    baseURL: getAPI(),
    timeout: 1000 * 2,
  });

  /**
   * 请求拦截器
   */
  instance.interceptors.request.use((config: AxiosRequestConfig) => {
    if (config.url === '/user/login/'){
      return config
    } else {
      if (userStore.getToken){
        config.headers.Authorization = "Token " + userStore.getToken
        return config
      }
      return config
    }
  });

  /**
   * 响应拦截器
   */
  instance.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      const result: ServiceResult = response.data;
      const code = response.status;
      if (Number(code) === 200) {
        return result;
      } else if (Number(code) === 700) {
        result.data = null;
        return result;
      } else {
        serviceErrorHandel(result);
        return Promise.reject(result);
      }
    },
    (error: AxiosError) => {
      httpErrorHandle(error);
      return Promise.reject(error);
    },
  );

  return new Promise((resolve, reject) => {
    instance
      .request<any, AxiosResponse<ServiceResult>>(config)
      .then((res: AxiosResponse<ServiceResult>) => {
        resolve(res as unknown as Promise<T>);
      })
      .catch((e: Error | AxiosError) => {
        reject(e);
      });
  });
}

/**
 * 业务错误
 * @param {*} res 业务约定的返回数据
 * @param {number} res.code 业务约定的错误码
 * @param {string} res.msg 业务上的错误信息
 * @param {*} res.data
 */
function serviceErrorHandel(res: ServiceResult) {
  const { code, msg } = res;
  if (Number(code) === 401) {
    Toast.clear();
    const userStore = useUserStoreWithOut();
    userStore.logout({ goLogin: true });
  } else {
    Toast({
      message: msg || 'Result Error',
      duration: 1000 * 3,
    });
  }
}

/**
 * HTTP 错误
 */
function httpErrorHandle(error: AxiosError) {
  // console.log('[httpErrorHandle]', error);
  // console.log('[httpErrorHandle]', error.toString());

  let msg = '';

  if (error?.response) {
    const { status } = error.response;
    const userStore = useUserStoreWithOut();

    switch (status) {
      case 401:
        msg = `${status} 没有权限，返回登录！`;
        userStore.logout({ goLogin: true });
        break;
      case 403:
        msg = `${status} 网络请求被拒绝`;
        break;
      case 404:
        msg = `${status} 网络请求不存在`;
        break;
      case 500:
        msg = `${status} 服务器内部错误`;
        break;
      default:
        msg = `${status || error.message}`;
        break;
    }
  }

  if (error.message.includes('timeout')) {
    msg = '请求超时';
  }

  if (error.message.includes('Network Error')) {
    msg = '当前网络不可用，请检查你的网络设置';
  }
  console.log(msg)
  Toast({
    message: msg || error.toString(),
    duration: 1000 * 3,
  });
}

export const request = createRequest;
