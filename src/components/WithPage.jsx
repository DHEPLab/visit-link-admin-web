// Higer-Order Component to enhance the paging
import React, { useCallback, useEffect, useState } from "react";
import Axios from "axios";
import { debounce } from "lodash";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

// first page start at 0
const page = 0;
// default page size
const size = 10;

/**
 * A higher-order component (HOC) that wraps a given React component and handles
 * data loading based on an API request. The data can be loaded on mount or triggered
 * manually based on the `loadOnMount` flag.
 *
 * @param {React.ComponentType} WrapperComponent - The React component to be wrapped.
 * @param {string} [url] - The API request URL for fetching data.
 * @param {Object} [params] - The optional parameters for the API request.
 * @param {boolean} [loadOnMount=true] - A flag indicating whether the data should be loaded when the component mounts.
 *
 * @returns {React.ComponentType} - A new React component that wraps the provided `WrapperComponent`.
 */
export default function withPage(
  WrapperComponent,
  // api request url
  url,
  // api request params
  params,
  loadOnMount = true,
) {
  return function (props) {
    const { t } = useTranslation(["common"]);
    const history = useHistory();
    const historyPageState = history?.location.state?.page?.[url];
    const [search, setSearch] = useState(
      historyPageState || {
        page,
        size,
      },
    );
    const [requestURL, setRequestURL] = useState(url);
    const [totalElements, setTotalElements] = useState(0);
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadData = useCallback(() => {
      if (!requestURL) return;
      const newParams = {
        ...search,
        ...params,
      };
      setLoading(true);
      Axios.get(requestURL, {
        params: newParams,
      })
        .then(({ data }) => {
          setTotalElements(data.totalElements);
          setContent(data.content);

          const hPageState = history?.location.state?.page;
          window.history.replaceState(
            {
              key: history.location.key,
              state: {
                page: {
                  ...(hPageState || {}),
                  [url]: newParams,
                },
              },
            },
            null,
            window.location.href,
          );
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
        // 是否展示 pageSize 切换器，当 total 大于 50 时默认为 true
        showSizeChanger: false,
        pageSize: size,
        current: search.page + 1,
        total: totalElements,
        showTotal(total) {
          return `${t("total")} ${total} ${t("unit.item")}`;
        },
      };
    }

    const debounceChangeSearch = debounce((key, value) => {
      setSearch((s) => {
        const newParams = { ...s, page: 0, [key]: value };
        if (value === "") {
          delete newParams[key];
        }
        return newParams;
      });
    }, 400);

    function handleChangePage({ current }) {
      setSearch((s) => ({
        ...s,
        page: current - 1,
      }));
    }

    function handleChangeLoadURL(url) {
      setRequestURL(url);
      setSearch({
        page,
        size,
      });
    }

    return (
      <WrapperComponent
        loading={loading}
        historyPageState={historyPageState}
        pagination={pagination()}
        dataSource={content}
        loadData={loadData}
        onChangeLoadURL={handleChangeLoadURL}
        onChangeSearch={debounceChangeSearch}
        onChangePage={handleChangePage}
        onChange={handleChangePage}
        {...props}
      />
    );
  };
}
