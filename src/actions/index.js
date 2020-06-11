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

export function loadProfileSuccess({ data }) {
  return {
    type: 'LOAD_PROFILE_SUCCESS',
    payload: data,
  };
}
