import { useEffect, useState } from "react";
import axios from "axios";

export default function useFetch<T>(
  url: string,
  params = {},
  initialState: T = {} as T,
  manualFetch = false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): [T, (search?: any, signal?: AbortSignal) => void] {
  const [data, setData] = useState<T>(initialState);

  function load(search = {}, signal?: AbortSignal) {
    axios
      .get<T>(url, {
        params: {
          ...params,
          ...search,
        },
        signal,
      })
      .then((r) => setData(r.data))
      .catch((err) => {
        if (!axios.isCancel(err)) {
          return Promise.reject(err);
        }
      });
  }

  useEffect(() => {
    const abortController = new AbortController();

    if (!manualFetch) {
      load({}, abortController.signal);
    }

    return () => abortController.abort();
  }, []);
  return [data, load];
}
