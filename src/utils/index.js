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
