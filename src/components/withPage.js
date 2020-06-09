// Higer-Order Component to enhance the paging
import React, { useState, useCallback, useEffect } from 'react';
import Axios from 'axios';
import { debounce } from 'lodash';

// first page start at 0
const page = 0;
// default page size
const size = 10;

export default function (
  WrapperComponent,
  // api request url
  url,
  // api request params
  params,
  loadOnMount = true
) {
  return function (props) {
    const [search, setSearch] = useState({
      page,
      size,
    });
    const [totalElements, setTotalElements] = useState(0);
    const [content, setContent] = useState([]);

    const loadData = useCallback(() => {
      Axios.get(url, {
        params: {
          ...search,
          ...params,
        },
      }).then(({ data }) => {
        setTotalElements(data.totalElements);
        setContent(data.content);
      });
    });

    useEffect(() => {
      if (loadOnMount) {
        loadData();
      }
    }, [loadData]);

    function pagination() {
      return {
        pageSize: size,
        total: totalElements,
        showTotal(total) {
          return `共 ${total} 条`;
        },
      };
    }

    const debounceChangeSearch = debounce((key, value) => {
      setSearch((s) => ({
        ...s,
        page: 0,
        [key]: value,
      }));
    }, 400);

    function onChangePage({ current }) {
      setSearch((s) => ({
        ...s,
        page: current - 1,
      }));
    }

    return (
      <WrapperComponent
        pagination={pagination}
        dataSource={content}
        loadData={loadData}
        onChangeSearch={debounceChangeSearch}
        onChangePage={onChangePage}
        {...props}
      />
    );
  };
}
