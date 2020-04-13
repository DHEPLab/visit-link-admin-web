import axios from 'axios';

export function applyToken(token) {
  if (token) {
    localStorage.setItem('HEALTH_FUTURE_JWT', token);
    axios.defaults.headers['Authorization'] = 'Bearer ' + token;
  }
}

export function getToken() {
  return localStorage.getItem('HEALTH_FUTURE_JWT');
}
