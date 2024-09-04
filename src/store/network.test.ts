import { useNetworkStore } from "./network";

describe("Network store", () => {
  const { httpRequestStart, httpRequestEnd } = useNetworkStore.getState();

  it("should initialize with default state", () => {
    const state = useNetworkStore.getState();
    expect(state.total).toBe(0);
    expect(state.requests).toEqual({});
  });

  it("should correctly handle httpRequestStart", () => {
    httpRequestStart("/page?query=1");
    const state = useNetworkStore.getState();
    expect(state.total).toBe(1);
    expect(state.requests).toEqual({ "/page": 1 });
  });

  it("should correctly handle httpRequestEnd", () => {
    httpRequestStart("/page?query=1");
    httpRequestEnd("/page?query=1");
    const state = useNetworkStore.getState();
    expect(state.total).toBe(0);
    expect(state.requests).toEqual({ "/page": 0 });
  });

  it("should handle multiple requests correctly", () => {
    httpRequestStart("/page1?query=1");
    httpRequestStart("/page2?query=2");
    httpRequestEnd("/page1?query=1");

    const state = useNetworkStore.getState();
    expect(state.total).toBe(1);
    expect(state.requests).toEqual({ "/page1": 0, "/page2": 1 });
  });

  it("should correctly handle the same path with different queries", () => {
    httpRequestStart("/page?query=1");
    httpRequestStart("/page?query=2");
    httpRequestEnd("/page?query=1");

    const state = useNetworkStore.getState();
    expect(state.total).toBe(1);
    expect(state.requests).toEqual({ "/page": 1 });
  });
});
