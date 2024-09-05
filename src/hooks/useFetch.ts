import { useEffect, useState } from "react";
import axios from "axios";

export default function useFetch<T>(
  url: string,
  params = {},
  initialState: T = {} as T,
  manualFetch = false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): [T, (search?: any) => void] {
  const [data, setData] = useState<T>(initialState);

  function load(search = {}) {
    axios
      .get<T>(url, {
        params: {
          ...params,
          ...search,
        },
      })
      .then((r) => setData(r.data));
  }

  useEffect(() => {
    if (!manualFetch) {
      load();
    }
  }, []);
  return [data, load];
}
