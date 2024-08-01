import Axios from "axios";
import { message } from "antd";
import { httpRequestStart, httpRequestEnd } from "./actions";
import { clearToken } from "./utils/token";
import store from "./store";
import { Message } from "./components/*";
import i18n from "./i18n";

const urlInfo = {
  get: [],
  post: [
    {
      url: "/admin/curriculums/draft",
      isequals: true,
      title: "草稿保存成功",
      context: "",
    },
    {
      url: "/admin/curriculums/",
      isequals: false,
      title: "添加成功",
      context: "",
      endsWith: "babies",
    }, //大纲分配宝宝列表添加新宝宝
    {
      url: "/admin/curriculums",
      isequals: true,
      title: "发布成功",
      context: "大纲已发布，可以添加宝宝后在app端查看",
    },
    {
      url: "/admin/modules/draft",
      isequals: true,
      title: "草稿保存成功",
      context: "",
    },
    {
      url: "/admin/modules",
      isequals: true,
      title: "发布成功",
      context: "模块已发布，可在课堂编辑时关联此模块",
    },
  ],
  put: [
    {
      url: "/admin/curriculums/draft",
      isequals: true,
      title: "草稿保存成功",
      context: "",
    },
    {
      url: "/admin/users/",
      isequals: false,
      title: "密码修改成功",
      context: "",
      endsWith: "/password",
    },
    {
      url: "/admin/users/",
      isequals: false,
      title: i18n.t('saveSuccessfully', { ns: "user" }),
      context: "",
      endsWith: "",
    },
    {
      url: "/admin/modules/draft",
      isequals: true,
      title: "草稿保存成功",
      context: "",
    },
    {
      url: "/admin/curriculums",
      isequals: true,
      title: "发布成功",
      context: "大纲已发布，可以添加宝宝后在app端查看",
    },
    {
      url: "/admin/modules",
      isequals: true,
      title: "发布成功",
      context: "模块已发布，可在课堂编辑时关联此模块",
    },
  ],
  delete: [
    {
      url: "/admin/carers/",
      isequals: false,
      title: i18n.t('deleteSuccessfully', { ns: 'baby' }),
      context: "",
      endsWith: "",
    }, //删除看护人 
    {
      url: "/admin/curriculums/",
      isequals: false,
      title: "删除成功",
      context: "",
      endsWith: "",
    }, //删除大纲
    {
      url: "/admin/modules/",
      isequals: false,
      title: "删除成功",
      context: "",
      endsWith: "",
    }, //删除模块
    {
      url: "/admin/babies/",
      isequals: false,
      title: i18n.t('deleteSuccessfully', { ns: 'baby' }),
      context: "",
      endsWith: "curriculum",
    }, //大纲分配宝宝列表删除宝宝
    {
      url: "/admin/babies/",
      isequals: false,
      title: i18n.t('unbindSuccessfully', { ns: "user" }),
      context: "",
      endsWith: "chw",
    }, //社区工作者解绑宝宝
    {
      url: "/admin/users/chw/",
      isequals: false,
      title: i18n.t('unbindSuccessfully', { ns: "user" }),
      context: "",
      endsWith: "supervisor",
    }, //负责社区工作者列表解绑社区工作者
  ],
};

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

    let msg = i18n.t('serviceError', { ns: "error" });
    switch (response.status) {
      case 502:
        msg = i18n.t('networkError', { ns: "error" });
        break;
      case 500:
        break;
      case 401:
        clearToken();
        if (!window.location.pathname.includes("/sign_in")) {
          window.location.href = "/sign_in";
        }
        return Promise.reject(error);
      default:
        const { data } = response;
        if (data.violations) {
          // msg = data.violations.map((e) => `${e.field} ${e.message}`).join(', ');
          msg = data.violations[0] ? `${data.violations[0]?.field} ${data.violations[0]?.message}` : "表单校验失败";
        } else if (data.i18nErrorKey) {
          msg = i18n.t(data.i18nErrorKey, { ...data.i18nContext, ns: "error", })
        }
        else if (data.detail) {
          msg = data.detail;
        }
    }
    message.error(msg);
    return Promise.reject(error);
  }
);

function overallSituationTips(method, url) {
  let infoArray = urlInfo[method];
  let result = infoArray.filter((e) => (e["isequals"] && url === e.url) || (!e["isequals"] && url.includes(e.url)));
  if (result && result.length === 1) {
    Message.success(result[0].title, result[0].context);
  } else if (result && result.length > 1) {
    let res = result.filter((e) => (!e["isequals"] && url.endsWith(e["endsWith"])) || e["isequals"] === true);
    if (res && res.length > 0) {
      Message.success(res[0].title, res[0].context);
    }
  }
}
