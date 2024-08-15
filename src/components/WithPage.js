// Higer-Order Component to enhance the paging
import React, { useCallback, useEffect, useState } from "react";
import Axios from "axios";
import { debounce } from "lodash";
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';

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
        const { t } = useTranslation(["common"]);
        const history = useHistory();
        const historyPageState = history?.location.state?.page?.[url]
        const [search, setSearch] = useState(historyPageState || {
            page,
            size,
        });
        const [requestURL, setRequestURL] = useState(url);
        const [totalElements, setTotalElements] = useState(0);
        const [content, setContent] = useState([]);
        const [loading, setLoading] = useState(false)

        const loadData = useCallback(() => {
            if (!requestURL) return;
            const newParams = {
                ...search,
                ...params,
            }
            setLoading(true)
            Axios.get(requestURL, {
                params: newParams,
            }).then(({ data }) => {
                setTotalElements(data.totalElements);
                setContent(data.content);

                const hPageState = history?.location.state?.page
                window.history.replaceState({
                    key: history.location.key,
                    state: {
                        page: {
                            ...(hPageState || {}),
                            [url]: newParams
                        }
                    },
                }, null, window.location.href)
            }).finally(_ => setLoading(false));
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
                    return `${t('total')} ${total} ${t('unit.item')}`;
                },
            };
        }

        const debounceChangeSearch = debounce((key, value) => {
            setSearch((s) => {
                const newParams = { ...s, page: 0, [key]: value }
                if (value === "") {
                    delete newParams[key]
                }
                return newParams
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
