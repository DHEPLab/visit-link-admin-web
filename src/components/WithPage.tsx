import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { debounce } from "radash";
import { useLocation, useNavigate } from "react-router-dom";

interface SearchValues {
  page?: number;
  size?: number;
  search?: string;
}

interface Pagination {
  showSizeChanger: boolean;
  pageSize: number;
  current: number;
  total: number;
  showTotal: (total: number) => string;
}

export interface WithPageProps {
  loading: boolean;
  historyPageState?: SearchValues;
  pagination: Pagination;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSource: any[];
  loadData?: VoidFunction;
  onChangeLoadURL: (url: string) => void;
  onChangeSearch: (key: string, value: string | null) => void;
  onChangePage: (pagination: { current?: number }) => void;
  onChange: (pagination: { current?: number }) => void;
}

const defaultSearchValues: SearchValues = { page: 0, size: 10 };

export default function withPage<T extends WithPageProps>(
  WrapperComponent: React.ComponentType<T>,
  apiRequestUrl: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiRequestParams?: Record<string, any>,
  loadOnMount = true,
) {
  return function (props: Omit<T, keyof WithPageProps>): JSX.Element {
    const location = useLocation();
    const navigate = useNavigate();
    const historyPageState = location.state?.page?.[apiRequestUrl] as SearchValues;
    const [search, setSearch] = useState<SearchValues>(historyPageState || defaultSearchValues);
    const [requestURL, setRequestURL] = useState(apiRequestUrl);
    const [totalElements, setTotalElements] = useState(0);
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadData = useCallback(() => {
      if (!requestURL) return;
      const newParams = {
        ...search,
        ...apiRequestParams,
      };
      setLoading(true);
      axios
        .get(requestURL, {
          params: newParams,
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
        .finally(() => setLoading(false));
    }, [search, requestURL]);

    useEffect(() => {
      if (loadOnMount) {
        loadData();
      }
    }, [loadData]);

    function pagination() {
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

    function handleChangePage({ current }: { current: number }) {
      setSearch((s) => ({
        ...s,
        page: current - 1,
      }));
    }

    function handleChangeLoadURL(url: string) {
      setRequestURL(url);
      setSearch(defaultSearchValues);
    }

    return (
      <WrapperComponent
        {...(props as T)}
        loading={loading}
        historyPageState={historyPageState}
        pagination={pagination()}
        dataSource={content}
        loadData={loadData}
        onChangeLoadURL={handleChangeLoadURL}
        onChangeSearch={debounceChangeSearch}
        onChangePage={handleChangePage}
        onChange={handleChangePage}
      />
    );
  };
}
