import { useState } from "react";

export default function useBoolState(initialState = false): [boolean, VoidFunction, VoidFunction] {
  const [value, setValue] = useState(initialState);
  const setBoolTrue = () => {
    setValue(true);
  };
  const setBoolFalse = () => {
    setValue(false);
  };
  return [value, setBoolTrue, setBoolFalse];
}
