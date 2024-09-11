import { act, renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse, HttpResponseResolver } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { usePagination } from "./usePagination";

const dispatchRequest = vi.fn();
const paginationResolver: HttpResponseResolver = ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  const size = url.searchParams.get("size");
  const content = Array.from({ length: Number(size) }, (_, index) => ({
    id: index + 1 + Number(page) * Number(size),
    name: `Item ${index + 1 + Number(page) * Number(size)}`,
  }));

  return HttpResponse.json({
    content,
    totalElements: 100,
  });
};
const server = setupServer(http.get("/api/mock-endpoint", paginationResolver));
server.events.on("request:start", dispatchRequest);

describe("usePagination Hook", () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    dispatchRequest.mockReset();
  });
  afterAll(() => server.close());

  it("should load data on mount", async () => {
    const { result } = renderHook(
      () =>
        usePagination<{ id: number; name: string }>({
          apiRequestUrl: "/api/mock-endpoint",
          apiRequestParams: { page: 0, size: 10 },
        }),
      { wrapper: ({ children }) => <MemoryRouter initialEntries={["/resources"]}>{children}</MemoryRouter> },
    );

    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.dataSource).toHaveLength(10);
      expect(result.current.pagination.total).toBe(100);
    });
  });

  it("should handle page change", async () => {
    const { result } = renderHook(
      () =>
        usePagination<{ id: number; name: string }>({
          apiRequestUrl: "/api/mock-endpoint",
          apiRequestParams: { page: 0, size: 10 },
        }),
      { wrapper: ({ children }) => <MemoryRouter initialEntries={["/resources"]}>{children}</MemoryRouter> },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.onChangePage({ current: 2 });
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.dataSource[0].id).toBe(11);
    });
  });

  it("should debounce search and update data", async () => {
    const { result } = renderHook(
      () =>
        usePagination<{ id: number; name: string }>({
          apiRequestUrl: "/api/mock-endpoint",
          apiRequestParams: { page: 0, size: 10 },
        }),
      { wrapper: ({ children }) => <MemoryRouter initialEntries={["/resources"]}>{children}</MemoryRouter> },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      vi.useFakeTimers();
      result.current.onChangeSearch("search", "I");
      result.current.onChangeSearch("search", "It");
      result.current.onChangeSearch("search", "Ite");
      result.current.onChangeSearch("search", "Item");
      vi.advanceTimersByTime(400);
      vi.useRealTimers();
    });

    expect(result.current.loading).toBe(true);
    expect(dispatchRequest).toHaveBeenLastCalledWith(
      expect.objectContaining({
        request: expect.objectContaining({
          url: expect.stringMatching(/api\/mock-endpoint\?page=0&size=10&search=Item$/),
        }),
      }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.dataSource).toHaveLength(10);
      expect(result.current.pagination.total).toBe(100);
    });
  });

  it("should reset to default search values when load URL is changed", async () => {
    server.use(http.get("/api/new-endpoint", paginationResolver));

    const { result } = renderHook(
      () =>
        usePagination<{ id: number; name: string }>({
          apiRequestUrl: "/api/mock-endpoint",
          apiRequestParams: { page: 0, size: 10 },
        }),
      { wrapper: ({ children }) => <MemoryRouter initialEntries={["/resources"]}>{children}</MemoryRouter> },
    );

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
    });

    act(() => {
      result.current.onChangeLoadURL("/api/new-endpoint");
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.dataSource).toHaveLength(10);
      expect(result.current.pagination.total).toBe(100);
    });
  });
});
