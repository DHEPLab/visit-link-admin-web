import { Page } from "@/models/res/Page";
import { useNetworkStore } from "@/store/network";
import { TablePaginationConfig } from "antd/es/table/interface";
import axios from "axios";
import { debounce } from "radash";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type usePaginationOptions = {
  apiRequestUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiRequestParams?: Record<string, any>;
  loadOnMount?: boolean;
};

interface SearchValues {
  page?: number;
  size?: number;
  search?: string;
}

export type usePaginationResult<T> = {
  loading: boolean;
  loadData: (signal?: AbortSignal) => void;
  historyPageState: SearchValues;
  pagination: TablePaginationConfig;
  dataSource: T[];
  resetSearch: VoidFunction;
  onChangeLoadURL: (url: string) => void;
  onChangeSearch: (key: string, value: string | null) => void;
  onChangePage: (pagination: { current?: number }) => void;
  onChange: (pagination: { current?: number }) => void;
};

const defaultSearchValues = { page: 0, size: 10 } satisfies SearchValues;

export const usePagination = <T>(options: usePaginationOptions) => {
  const { apiRequestUrl, apiRequestParams = {}, loadOnMount = true } = options;

  const location = useLocation();
  const navigate = useNavigate();
  const historyPageState = location.state?.page?.[apiRequestUrl] satisfies SearchValues;
  const [search, setSearch] = useState<SearchValues>(historyPageState || defaultSearchValues);
  const [requestURL, setRequestURL] = useState(apiRequestUrl);
  const [totalElements, setTotalElements] = useState(0);
  const [content, setContent] = useState<T[]>([]);
  const requests = useNetworkStore((state) => state.requests);
  const loading = requests[apiRequestUrl] >= 1;

  const resetDataToEmpty = () => {
    setTotalElements(0);
    setContent([]);
  };

  const loadData = useCallback(
    (signal?: AbortSignal) => {
      if (!requestURL) return;
      const newParams = {
        ...apiRequestParams,
        ...search,
      };
      axios
        .get<Page<T>>(requestURL, {
          params: newParams,
          signal,
        })
        .then(({ data }) => {
          setTotalElements(data.totalElements);
          setContent(data.content);

          const hPageState = location.state?.page;
          navigate(location.pathname, {
            replace: true,
            state: {
              page: {
                ...(hPageState || {}),
                [apiRequestUrl]: newParams,
              },
            },
          });
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            resetDataToEmpty();
          }
        });
    },
    [search, requestURL],
  );

  useEffect(() => {
    const abortController = new AbortController();

    if (loadOnMount) {
      loadData(abortController.signal);
    }

    return () => abortController.abort();
  }, [loadOnMount, loadData]);

  function pagination(): TablePaginationConfig {
    return {
      showSizeChanger: false,
      pageSize: defaultSearchValues.size,
      current: (search.page ?? 0) + 1,
      total: totalElements,
    };
  }

  const debounceChangeSearch = debounce({ delay: 400 }, (key: string, value: string | number | null) => {
    setSearch((s) => {
      const newParams = { ...s, page: 0, [key]: value };
      if (value === "") {
        delete newParams[key as keyof SearchValues];
      }
      return newParams;
    });
  });

  function handleChangePage({ current }: TablePaginationConfig) {
    if (current) {
      setSearch((s) => ({
        ...s,
        page: current - 1,
      }));
    }
  }

  function handleChangeLoadURL(url: string) {
    setRequestURL(url);
    setSearch(defaultSearchValues);
  }

  function resetSearch() {
    setSearch(defaultSearchValues);
  }

  return {
    loading,
    loadData,
    historyPageState,
    pagination: pagination(),
    dataSource: content,
    resetSearch,
    onChangeLoadURL: handleChangeLoadURL,
    onChangeSearch: debounceChangeSearch,
    onChangePage: handleChangePage,
    onChange: handleChangePage,
  };
};
