import { useSearchParams } from "react-router-dom";
import { useState } from "react";

const useQueryParam = (key: string, defaultValue?: string) => {
  const [searchParams] = useSearchParams();

  const [value, setValue] = useState(searchParams.get(key) || defaultValue);

  return [value, setValue];
};

export default useQueryParam;
