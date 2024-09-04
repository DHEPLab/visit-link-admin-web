import { act, renderHook, waitFor } from "@testing-library/react";
import useFetch from "./useFetch";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

describe("useFetch", () => {
  const response = { message: "Hello" };
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
});
