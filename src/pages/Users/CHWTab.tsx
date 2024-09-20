import { usePagination } from "@/hooks/usePagination";
import { ChwUser } from "@/models/res/User";
import { Space, Tag } from "antd";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import SearchInput from "@/components/SearchInput";
import ZebraTable from "@/components/ZebraTable";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { phone, realName, username } from "./tableColumnConfig";

type CHWProps = {
  refreshKey: number;
};

const CHWTab: React.FC<CHWProps> = ({ refreshKey }) => {
  const { t } = useTranslation(["users", "common"]);
  const navigate = useNavigate();
  const { historyPageState, loading, dataSource, pagination, loadData, onChange, onChangeSearch } =
    usePagination<ChwUser>({
      apiRequestUrl: "/admin/users/chw",
      loadOnMount: false,
    });

  useEffect(() => {
    const abortController = new AbortController();
    loadData(abortController.signal);
    return () => abortController.abort();
  }, [refreshKey, loadData]);

  return (
    <div>
      <ChwBar>
        <SearchInput
          defaultValue={historyPageState?.search}
          style={{ width: "420px" }}
          onChange={(e) => onChangeSearch("search", e.target.value)}
          placeholder={t("searchChwPlaceholder")}
        />
      </ChwBar>
      <ZebraTable
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        onChange={onChange}
        className="clickable"
        scroll={{ x: true }}
        rowKey={(record) => record.user.id}
        onRow={(record) => ({
          onClick: () => {
            navigate(`/users/${record.user.id}`);
          },
        })}
        columns={[
          realName,
          {
            title: t("id"),
            width: 150,
            dataIndex: ["user", "chw", "identity"],
          },
          {
            title: t("area"),
            width: 350,
            dataIndex: ["user", "chw", "tags"],
            render: (tags) => (
              <Space wrap>
                {tags.map((tag: string, index: number) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </Space>
            ),
          },
          phone,
          {
            title: t("supervisor"),
            width: 120,
            dataIndex: ["user", "chw", "supervisor", "realName"],
          },
          {
            title: t("babyCount"),
            width: 150,
            dataIndex: "babyCount",
            render: (h) => `${h} ${t("unit.person", { ns: "common" })}`,
          },
          username,
          {
            title: t("completion"),
            width: 120,
            dataIndex: "hasFinish",
            render: (hasFinish, v) => `${hasFinish} / ${v.shouldFinish}`,
          },
          {
            title: t("completionRate"),
            width: 100,
            dataIndex: "shouldFinish",
            render: (shouldFinish, v) => {
              const percent = Number(Number((v.hasFinish / shouldFinish) * 100).toFixed(2));
              return `${shouldFinish === 0 ? 0 : percent}%`;
            },
          },
        ]}
      />
    </div>
  );
};

const ChwBar = styled.div`
  height: 76px;
  padding-left: 30px;
  padding-right: 20px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ffc3a0;
`;

export default CHWTab;
