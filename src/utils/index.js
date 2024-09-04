import { useState, useEffect } from "react";
import axios from "axios";

export function useFetch(url, params = {}, initialState = {}) {
  const [data, setData] = useState(initialState);

  function load(search = {}) {
    axios
      .get(url, {
        params: {
          ...params,
          ...search,
        },
      })
      .then((r) => setData(r.data));
  }

  useEffect(load, []);
  return [data, load];
}

export function useManualFetch(url, params = {}, initialState = {}) {
  const [data, setData] = useState(initialState);

  function load(search = {}) {
    axios
      .get(url, {
        params: {
          ...params,
          ...search,
        },
      })
      .then((r) => setData(r.data));
  }

  return [data, load];
}
