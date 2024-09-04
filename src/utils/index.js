import { useState } from "react";
import axios from "axios";

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
