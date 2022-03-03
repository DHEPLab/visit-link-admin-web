import { useState, useEffect } from "react";
import Axios from "axios";

export function useFetch(url, params = {}, initialState = {}) {
  const [data, setData] = useState(initialState);

  function load(search = {}) {
    Axios.get(url, {
      params: {
        ...params,
        ...search,
      },
    }).then((r) => setData(r.data));
  }

  useEffect(load, []);
  return [data, load];
}

export function useManualFetch(url, params = {}, initialState = {}) {
  const [data, setData] = useState(initialState);

  function load(search = {}) {
    Axios.get(url, {
      params: {
        ...params,
        ...search,
      },
    }).then((r) => setData(r.data));
  }

  return [data, load];
}

export function fileFormat(file) {
  if (!file.name) return;
  const array = file.name.split(".");
  return array[array.length - 1];
}

export function useBoolState(initialState = false) {
  const [bool, setBool] = useState(initialState);
  const setBoolTrue = () => {
    setBool(true);
  };
  const setBoolFalse = () => {
    setBool(false);
  };
  return [bool, setBoolTrue, setBoolFalse];
}

// return file path without query params
export function cleanQueryParams(path) {
  return path.split("?")[0];
}

//防抖函数
export const debounce = (func, delay = 1000, immediate = false) => {
  let timeout
  return function () {
    if (timeout) clearTimeout(timeout);

    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, delay)
      if (callNow) {
        let arr = [];
        for (let i = 0; i < arguments.length; i++) {
          arr.push(arguments[i])
        }
        arr.push(this);
        func.call(this, ...arr);
      }
    } else {
      timeout = setTimeout(() => {
        let arr = [];
        for (let i = 0; i < arguments.length; i++) {
          arr.push(arguments[i])
        }
        arr.push(this);
        func.call(this, ...arr);
      }, delay)
    }
  }
}
//节流函数
export const throttle = (func, delay = 1000, immediate = false) => {
  let timeout;
  let previous = immediate? 0 : undefined;
  return function () {
    if (immediate) {
      let now = Date.now();
      if (now - previous > delay) {
        let arr = [];
        for (let i = 0; i < arguments.length; i++) {
          arr.push(arguments[i])
        }
        arr.push(this);
        func.call(this, ...arr, () => previous = now - delay);
        previous = now;
      }
    } else {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          let arr = [];
          for (let i = 0; i < arguments.length; i++) {
            arr.push(arguments[i])
          }
          arr.push(this);
          func.call(this, ...arr, () => timeout = null);
        }, delay)
      }
    }
  }
}