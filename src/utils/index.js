import { useState, useEffect } from 'react';
import Axios from 'axios';

export function useFetch(url, params, initialState = {}) {
  const [data, setData] = useState(initialState);

  function load() {
    Axios.get(url, {
      params,
    }).then((r) => setData(r.data));
  }

  useEffect(load, []);
  return [data, load];
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
  return path.split('?')[0];
}
