import Axios from 'axios';
import { message } from 'antd';
import { httpRequestStart, httpRequestEnd } from './actions';
import { clearToken } from './utils/token';
import store from './store';
import { Message } from './components/*';

const urlInfo = {
  get: [],
  post: [
    { url: "/admin/curriculums/draft", isequals: true, title: "操作成功", context: "草稿保存成功" },
    { url: "/admin/curriculums/", isequals: false, title: "操作成功", context: "添加成功", endsWith: "babies" },//大纲分配宝宝列表添加新宝宝
    { url: "/admin/curriculums", isequals: true, title: "发布成功", context: "大纲已发布，可以添加宝宝后在app端查看" },
    { url: "/admin/modules/draft", isequals: true, title: "操作成功", context: "草稿保存成功" },
    { url: "/admin/modules", isequals: true, title: "发布成功", context: "模块已发布，可在课堂编辑时关联此模块" },
  ],
  put: [
    { url: "/admin/curriculums/draft", isequals: true, title: "操作成功", context: "草稿保存成功" },
    { url: "/admin/users/", isequals: false, title: "操作成功", context: "密码修改成功", endsWith: "/password" },
    { url: "/admin/users/", isequals: false, title: "操作成功", context: "保存成功", endsWith: "" },
    { url: "/admin/modules/draft", isequals: true, title: "操作成功", context: "草稿保存成功" },
    { url: "/admin/curriculums", isequals: true, title: "发布成功", context: "大纲已发布，可以添加宝宝后在app端查看" },
    { url: "/admin/modules", isequals: true, title: "发布成功", context: "模块已发布，可在课堂编辑时关联此模块" },
  ],
  delete: [
    { url: "/admin/carers/", isequals: false, title: "操作成功", context: "删除成功", endsWith: "" },//删除看护人
    { url: "/admin/curriculums/", isequals: false, title: "操作成功", context: "删除成功", endsWith: "" },//删除大纲
    { url: "/admin/modules/", isequals: false, title: "操作成功", context: "删除成功", endsWith: "" },//删除模块
    { url: "/admin/babies/", isequals: false, title: "操作成功", context: "删除成功", endsWith: "curriculum" },//大纲分配宝宝列表删除宝宝
    { url: "/admin/babies/", isequals: false, title: "操作成功", context: "解绑成功", endsWith: "chw" },//社区工作者解绑宝宝
    { url: "/admin/users/chw/", isequals: false, title: "操作成功", context: "解绑成功", endsWith: "supervisor" },//负责社区工作者列表解绑社区工作者
  ]
}

Axios.interceptors.request.use((config) => {
  store.dispatch(httpRequestStart(config));
  return config;
});

Axios.interceptors.response.use(
  (response) => {
    store.dispatch(httpRequestEnd(response.config));
    overallSituationTips(response.config.method, response.config.url);
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

function overallSituationTips(method, url) {
  let infoArray = urlInfo[method]
  let result = infoArray.filter(e => (e["isequals"] && url === e.url) || (!e["isequals"] && url.includes(e.url)));
  console.log("拿到头结果", result)
  if (result && result.length === 1) {
    Message.success(result[0].title, result[0].context);
  } else if (result && result.length > 1) {
    let res = result.filter(e => (!e["isequals"] && url.endsWith(e["endsWith"])) || e["isequals"] === true);
    console.log(res, 88888)
    if (res && res.length > 0) {
      Message.success(res[0].title, res[0].context);
    }
  }
}