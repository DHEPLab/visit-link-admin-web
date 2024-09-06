import { useSearchParams } from "react-router-dom";
import { useState } from "react";

type useQueryParamReturns<T> = T extends string
  ? [string, (value: string) => void]
  : [string | undefined, (value: string | undefined) => void];

const useQueryParam = <T extends string>(key: string, defaultValue?: T) => {
  const [searchParams] = useSearchParams();
  const initialState = searchParams.get(key) || defaultValue;

  return useState(initialState) as useQueryParamReturns<T>;
};

export default useQueryParam;
