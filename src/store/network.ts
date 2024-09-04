import { create } from "zustand";
import { middlewares } from "./middlewares";

interface NetworkState {
  total: number;
  requests: {
    [key: string]: number;
  };
  httpRequestStart: (url: string) => void;
  httpRequestEnd: (url: string) => void;
}

export const useNetworkStore = create<NetworkState>()(
  middlewares(
    (set) => ({
      total: 0,
      requests: {},
      httpRequestStart: (url: string) =>
        set((state) => {
          const path = new URL(url, window.location.origin).pathname;
          return {
            total: state.total + 1,
            requests: {
              ...state.requests,
              [path]: (state.requests[path] || 0) + 1,
            },
          };
        }),
      httpRequestEnd: (url: string) =>
        set((state) => {
          const path = new URL(url, window.location.origin).pathname;
          return {
            total: state.total - 1,
            requests: {
              ...state.requests,
              [path]: (state.requests[path] || 0) - 1,
            },
          };
        }),
    }),
    "networkStore",
  ),
);
