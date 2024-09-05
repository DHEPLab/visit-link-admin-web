import axios from "axios";

const KEY = "VISIT_LINK_JWT";

export function applyToken(token?: string | null): void {
  if (token) {
    localStorage.setItem(KEY, token);
    axios.defaults.headers["Authorization"] = "Bearer " + token;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(KEY);
}

export function clearToken(): void {
  localStorage.setItem(KEY, "");
  axios.defaults.headers["Authorization"] = "";
}
