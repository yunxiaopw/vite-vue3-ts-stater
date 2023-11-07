import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { RequestConfigType, ResponseType } from './types';
import { ElMessage } from 'element-plus';

const env = import.meta.env;
const onError = (err: any) => {
  if (err.message.includes('timeout')) {
    ElMessage({
      message: 'error',
      type: 'error',
    });
  }
  return Promise.reject(err);
};

const instance: AxiosInstance = axios.create({
  baseURL: env.VITE_BASE_URL,
  // baseURL: 'http://api-v2.apkssr.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers['Access-Token'] = localStorage.getItem('Access_Token');
  config.headers['uid'] = localStorage.getItem('HERO_UID');
  return {
    ...config,
  };
}, onError);

instance.interceptors.response.use((response: AxiosResponse) => {
  if (response && response.data) {
    return Promise.resolve(response);
  } else {
    return Promise.reject('response error');
  }
}, onError);

const request = async <T>(config: RequestConfigType): Promise<ResponseType<T>> => {
  return new Promise((resolve, reject) => {
    try {
      const res = await instance.request<ResponseType<T>>(config);

      const data = res.data;
      if (data.code == 0) {
        if (config.successToast) {
          ElMessage({
            message: data.msg || 'success！',
            type: 'success',
          });
        }
        resolve(data);
      } else {
        if (data.code === 403 || data.code === 401) {
          window.location.href = env.VITE_BASE_URL;
        }
        if (config.errorToast) {
          ElMessage({
            message: t(`apiCodeErr.${data.code}`),
            type: 'error',
          });
        }
        reject(data);
      }
    } catch (err: any) {
      const data = {
        code: -1,
        msg: 'error',
        data: null as any,
      };
      ElMessage({
        message: data.msg,
        type: 'error',
      });
      reject(data);
    }
  });
};

/**
 *
 * @param url
 * @param params
 * @param successToast
 * @param errorToast
 */
export const getRequest = function <T>(
  url: string,
  params: object = {},
  successToast = false,
  errorToast = true,
): Promise<ResponseType<T>> {
  return request<T>({
    url,
    method: 'get',
    params: params,
    successToast,
    errorToast,
  });
};

/**
 *  post接口默认提示成功和失败
 * @param url
 * @param params
 * @param successToast
 * @param errorToast
 */
export const postRequest = function <T>(
  url: string,
  params: object = {},
  successToast = false,
  errorToast = true,
): Promise<ResponseType<T>> {
  return request<T>({
    url,
    method: 'post',
    data: params,
    successToast,
    errorToast,
  });
};

export default request;
