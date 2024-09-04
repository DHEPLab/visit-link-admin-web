import { act, renderHook } from "@testing-library/react";
import useBoolState from "./useBoolState";

describe("useBoolState", () => {
  it("should initialize with the correct value", () => {
    const { result: resultWithDefaultValue } = renderHook(() => useBoolState());
    const [defaultValue] = resultWithDefaultValue.current;

    expect(defaultValue).toBeFalsy();

    const { result } = renderHook(() => useBoolState(true));
    const [value] = result.current;

    expect(value).toBeTruthy();
  });

  it("should use bool state", async () => {
    const { result } = renderHook(() => useBoolState());
    const [, setTrue, setFalse] = result.current;
    act(() => {
      setTrue();
    });
    expect(result.current[0]).toBeTruthy();
    act(() => {
      setFalse();
    });
    expect(result.current[0]).toBeFalsy();
  });
});
