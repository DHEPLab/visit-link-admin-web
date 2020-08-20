import Axios from 'axios';
import { message } from 'antd';
import { httpRequestStart, httpRequestEnd } from './actions';
import { clearToken } from './utils/token';
import store from './store';

Axios.interceptors.request.use((config) => {
  store.dispatch(httpRequestStart(config));
  return config;
});

Axios.interceptors.response.use(
  (response) => {
    store.dispatch(httpRequestEnd(response.config));
    return response;
  },
  (error) => {
    const { response } = error;
    if (!response) return Promise.reject(error);
    store.dispatch(httpRequestEnd(response.config));

    let msg = '服务异常，请稍后重试';
    switch (response.status) {
      case 502:
        msg = '网络异常，请稍后重试';
        break;
      case 500:
        break;
      case 401:
        clearToken();
        if (!window.location.pathname.includes('/sign_in')) {
          window.location.href = '/sign_in';
        }
        return Promise.reject(error);
      default:
        const { data } = response;
        if (data.violations) {
          // msg = data.violations.map((e) => `${e.field} ${e.message}`).join(', ');
          msg = '表单校验失败';
        } else if (data.detail) {
          msg = data.detail;
        }
    }
    message.error(msg);
    return Promise.reject(error);
  }
);
