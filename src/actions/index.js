import { cleanQueryParams } from '../utils';

export function httpRequestStart(config) {
  return {
    type: 'HTTP_REQUEST_START',
    payload: cleanQueryParams(config.url),
  };
}

export function httpRequestEnd(config) {
  return {
    type: 'HTTP_REQUEST_END',
    payload: cleanQueryParams(config.url),
  };
}

export function apiAccountProfile({ data }) {
  return {
    type: 'LOAD_PROFILE_SUCCESS',
    payload: data,
  };
}

export function activeComponent(name) {
  return {
    type: 'ACTIVE_COMPONENT',
    payload: name,
  };
}

export function moduleFinishActionOptions(data) {
  const modules = data.content.map((module) => ({
    label: `${module.number} ${module.name}`,
    value: module.id,
  }));

  return {
    type: 'MODULE_FINISH_ACTION_OPTIONS',
    payload: [
      {
        label: '结束选项继续本层级内容',
        value: 'Continue',
      },
      {
        label: '跳转至其他模块并结束本内容模块',
        value: 'Redirect_End',
        children: modules,
      },
      {
        label: '跳转至其他模块并继续本层级内容',
        value: 'Redirect_Continue',
        children: modules,
      },
    ],
  };
}
