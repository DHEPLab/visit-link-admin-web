import axios from 'axios';

const KEY = 'HEALTHY_FUTURE_JWT';

export function applyToken(token) {
  if (token) {
    localStorage.setItem(KEY, token);
    axios.defaults.headers['Authorization'] = 'Bearer ' + token;
  }
}

export function getToken() {
  return localStorage.getItem(KEY);
}

export function clearToken() {
  localStorage.setItem(KEY, '');
}
