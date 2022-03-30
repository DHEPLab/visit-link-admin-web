// Higer-Order Component to enhance the paging
import React, {useState, useCallback, useEffect} from "react";
import Axios from "axios";
import {debounce} from "lodash";

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
        const [requestURL, setRequestURL] = useState(url);
        const [totalElements, setTotalElements] = useState(0);
        const [content, setContent] = useState([]);

        const loadData = useCallback(() => {
            if (!requestURL) return;
            Axios.get(requestURL, {
                params: {
                    ...search,
                    ...params,
                },
            }).then(({data}) => {
                setTotalElements(data.totalElements);
                setContent(data.content);
            });
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
                    return `共 ${total} 条`;
                },
            };
        }

        const debounceChangeSearch = debounce((key, value) => {
            setSearch((s) => {
                const newParams = {...s, page: 0, [key]: value}
                if (value === "") {
                    delete newParams[key]
                }
                return newParams
            });
        }, 400);

        function handleChangePage({current}) {
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
