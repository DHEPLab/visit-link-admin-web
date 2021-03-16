import React from "react";
import { Button, Space } from "antd";
import { useHistory } from "react-router-dom";

import { WithPage, ContentHeader, ZebraTable, SearchInput, StatusTag } from "../components/*";

function Surveys({ loadData, onChangeSearch, ...props }) {
  const history = useHistory();

  return (
    <>
      <ContentHeader title="问卷管理">
        <Space size="large">
          <SearchInput
            onChange={(e) => onChangeSearch("search", e.target.value)}
            className="master"
            placeholder="请输入问卷名称搜索"
          />
          <Button type="primary" onClick={() => history.push("/surveys/create")}>
            创建新问卷
          </Button>
        </Space>
      </ContentHeader>

      <ZebraTable
        {...props}
        rowKey="id"
        className="clickable"
        onRow={(record) => {
          return {
            onClick: () => {
              history.push(`/surveys/${record.id}`);
            },
          };
        }}
        columns={[
          {
            title: "问卷状态",
            dataIndex: "published",
            width: 120,
            align: "center",
            render: (h) => <StatusTag value={h} />,
          },
          {
            title: "问卷编号",
            dataIndex: "number",
          },
          {
            title: "问卷名称",
            dataIndex: "name",
          },
          {
            title: "问卷描述",
            dataIndex: "description",
          }
        ]}
      />
    </>
  );
}

export default WithPage(Surveys, "/admin/surveys?sort=id,desc");
