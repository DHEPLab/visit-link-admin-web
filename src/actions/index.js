import { cleanQueryParams } from "../utils";
import i18n from "i18next"; 

export function httpRequestStart(config) {
  return {
    type: "HTTP_REQUEST_START",
    payload: cleanQueryParams(config.url),
  };
}

export function httpRequestEnd(config) {
  return {
    type: "HTTP_REQUEST_END",
    payload: cleanQueryParams(config.url),
  };
}

export function apiAccountProfile({ data }) {
  return {
    type: "LOAD_PROFILE_SUCCESS",
    payload: data,
  };
}

export function activeComponent(name) {
  return {
    type: "ACTIVE_COMPONENT",
    payload: name,
  };
}

export function moduleFinishActionOptions(data) {
  const modules = data.content.map((module) => ({
    label: `${module.number} ${module.name}`,
    value: module.id,
  }));

  return {
    type: "MODULE_FINISH_ACTION_OPTIONS",
    payload: [
      {
        label: i18n.t("action:continueCurrentLevel"),
        value: "Continue",
      },
      {
        label: i18n.t("action:jumpToAnotherModuleAndEnd"),
        value: "Redirect_End",
        children: modules,
      },
      {
        label: i18n.t("action:jumpToAnotherModuleAndContinue"),
        value: "Redirect_Continue",
        children: modules,
      },
    ],
  };
}
