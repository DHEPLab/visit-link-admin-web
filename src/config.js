import Axios from "axios";
import { message } from "antd";
import { httpRequestStart, httpRequestEnd } from "./actions";
import { clearToken } from "./utils/token";
import store from "./store";
import { Message } from "./components";
import i18n from "./i18n";

const urlInfo = {
  get: [],
  post: [
    {
      url: "/admin/curriculums/draft",
      isequals: true,
      title: i18n.t("draftSaveSuccessfully", { ns: "config" }),
      context: "",
    },
    {
      url: "/admin/curriculums/",
      isequals: false,
      title: i18n.t("addSuccessfully", { ns: "config" }),
      context: "",
      endsWith: "babies",
    },
    {
      url: "/admin/curriculums",
      isequals: true,
      title: i18n.t("publishSuccessfully", { ns: "config" }),
      context: i18n.t("curriculumPublishedMessage", { ns: "config" }),
    },
    {
      url: "/admin/modules/draft",
      isequals: true,
      title: i18n.t("draftSaveSuccessfully", { ns: "config" }),
      context: "",
    },
    {
      url: "/admin/modules",
      isequals: true,
      title: i18n.t("publishSuccessfully", { ns: "config" }),
      context: i18n.t("modulePublishedMessage", { ns: "config" }),
    },
  ],
  put: [
    {
      url: "/admin/curriculums/draft",
      isequals: true,
      title: i18n.t("draftSaveSuccessfully", { ns: "config" }),
      context: "",
    },
    {
      url: "/admin/users/",
      isequals: false,
      title: i18n.t("passwordChangedSuccessfully", { ns: "config" }),
      context: "",
      endsWith: "/password",
    },
    {
      url: "/admin/users/",
      isequals: false,
      title: i18n.t("saveSuccessfully", { ns: "user" }),
      context: "",
      endsWith: "",
    },
    {
      url: "/admin/modules/draft",
      isequals: true,
      title: i18n.t("draftSaveSuccessfully", { ns: "config" }),
      context: "",
    },
    {
      url: "/admin/curriculums",
      isequals: true,
      title: i18n.t("publishSuccessfully", { ns: "config" }),
      context: i18n.t("curriculumPublishedMessage", { ns: "config" }),
    },
    {
      url: "/admin/modules",
      isequals: true,
      title: i18n.t("publishSuccessfully", { ns: "config" }),
      context: i18n.t("modulePublishedMessage", { ns: "config" }),
    },
  ],
  delete: [
    {
      url: "/admin/carers/",
      isequals: false,
      title: i18n.t("deleteSuccessfully", { ns: "baby" }),
      context: "",
      endsWith: "",
    },
    {
      url: "/admin/curriculums/",
      isequals: false,
      title: i18n.t("deleteSuccessfully", { ns: "config" }),
      context: "",
      endsWith: "",
    },
    {
      url: "/admin/modules/",
      isequals: false,
      title: i18n.t("deleteSuccessfully", { ns: "config" }),
      context: "",
      endsWith: "",
    },
    {
      url: "/admin/babies/",
      isequals: false,
      title: i18n.t("deleteSuccessfully", { ns: "baby" }),
      context: "",
      endsWith: "curriculum",
    },
    {
      url: "/admin/babies/",
      isequals: false,
      title: i18n.t("unbindSuccessfully", { ns: "user" }),
      context: "",
      endsWith: "chw",
    },
    {
      url: "/admin/users/chw/",
      isequals: false,
      title: i18n.t("unbindSuccessfully", { ns: "user" }),
      context: "",
      endsWith: "supervisor",
    },
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

    let msg = i18n.t("serviceError", { ns: "error" });
    switch (response.status) {
      case 502:
        msg = i18n.t("networkError", { ns: "error" });
        break;
      case 500:
        break;
      case 401:
        clearToken();
        if (!window.location.pathname.includes("/sign_in")) {
          window.location.href = "/sign_in";
        }
        return Promise.reject(error);
      default: {
        const { data } = response;
        if (data.violations) {
          // msg = data.violations.map((e) => `${e.field} ${e.message}`).join(', ');
          msg = data.violations[0]
            ? `${data.violations[0]?.field} ${data.violations[0]?.message}`
            : i18n.t("formValidationFailed", { ns: "error" });
        } else if (data.detail) {
          msg = data.detail;
        }
      }
    }
    message.error(msg);
    return Promise.reject(error);
  },
);

function overallSituationTips(method, url) {
  const infoArray = urlInfo[method];
  const result = infoArray.filter((e) => (e["isequals"] && url === e.url) || (!e["isequals"] && url.includes(e.url)));
  if (result && result.length === 1) {
    Message.success(result[0].title, result[0].context);
  } else if (result && result.length > 1) {
    const res = result.filter((e) => (!e["isequals"] && url.endsWith(e["endsWith"])) || e["isequals"] === true);
    if (res && res.length > 0) {
      Message.success(res[0].title, res[0].context);
    }
  }
}
