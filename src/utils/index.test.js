import Axios from "axios";
import * as utils from "./index";
import { renderHook, act, waitFor } from "@testing-library/react";

vi.mock("axios");

it("should fetch resource", async () => {
  Axios.get.mockResolvedValue({
    data: 2,
  });
  const { result } = renderHook(() => utils.useFetch("/api/fake"));

  await waitFor(() => {
    const [data] = result.current;
    expect(data).toBe(2);
  });
});

it("should manual fetch resource", async () => {
  Axios.get.mockResolvedValue({
    data: 3,
  });
  const { result } = renderHook(() => utils.useManualFetch("/api/fake"));
  const [, load] = result.current;
  act(() => load());

  await waitFor(() => {
    const [data] = result.current;
    expect(data).toBe(3);
  });
});

it("should use bool state", async () => {
  const { result } = renderHook(() => utils.useBoolState());
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
