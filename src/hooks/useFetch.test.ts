import { act, renderHook, waitFor } from "@testing-library/react";
import useFetch from "./useFetch";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

describe("useFetch", () => {
  const response = { message: "from server" };
  const server = setupServer(
    http.get("/greeting", () => {
      return HttpResponse.json(response);
    }),
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("should initialize with the correct initialState", () => {
    const initialState = { key: "value" };
    const { result } = renderHook(() => useFetch("/greeting", {}, initialState));

    expect(result.current[0]).toBe(initialState);
  });

  it("should fetch resource", async () => {
    const { result } = renderHook(() => useFetch("/greeting"));

    expect(result.current[0]).toEqual({});

    await waitFor(() => {
      expect(result.current[0]).toEqual(response);
    });
  });

  it("should include params and search query in the request", async () => {
    server.use(
      http.get("/greeting", ({ request }) => {
        const url = new URL(request.url);
        const lang = url.searchParams.get("lang");
        return HttpResponse.json({ message: `request lang is ${lang}` });
      }),
    );

    const { result } = renderHook(() => useFetch("/greeting", { lang: "en" }));

    await waitFor(() => {
      expect(result.current[0]).toEqual({ message: "request lang is en" });
    });

    act(() => {
      result.current[1]({ lang: "ch" });
    });

    await waitFor(() => {
      expect(result.current[0]).toEqual({ message: "request lang is ch" });
    });
  });

  it("should not auto-fetch when manualFetch is true", async () => {
    const dispatchRequest = vi.fn();
    server.events.on("request:start", dispatchRequest);
    const { result } = renderHook(() => useFetch("/greeting", {}, { message: "init value" }, true));

    expect(result.current[0]).toEqual({ message: "init value" });

    await waitFor(() => {
      expect(result.current[0]).toEqual({ message: "init value" });
      expect(dispatchRequest).not.toHaveBeenCalled();
    });

    act(() => {
      result.current[1]();
    });

    await waitFor(() => {
      expect(result.current[0]).toEqual(response);
      expect(dispatchRequest).toHaveBeenCalledTimes(1);
    });
  });
});
