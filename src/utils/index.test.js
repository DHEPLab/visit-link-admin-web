import axios from "axios";
import * as utils from "./index";
import { renderHook, act, waitFor } from "@testing-library/react";

vi.mock("axios");

it("should manual fetch resource", async () => {
  axios.get.mockResolvedValue({
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
