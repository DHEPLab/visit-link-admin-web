import ContentHeader from "@/components/ContentHeader";
import SearchInput from "@/components/SearchInput";
import StatusTag from "@/components/StatusTag";
import ZebraTable from "@/components/ZebraTable";

import { ModuleTopic } from "@/constants/enums";
import { usePagination } from "@/hooks/usePagination";
import { Curriculum } from "@/models/res/Curriculum";
import { Button, Space } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Modules: React.FC = () => {
  const { t } = useTranslation("modules");
  const navigate = useNavigate();

  const { historyPageState, loading, pagination, dataSource, onChange, onChangeSearch } = usePagination<Curriculum>({
    apiRequestUrl: "/admin/modules",
  });

  return (
    <>
      <ContentHeader title={t("moduleManagement")}>
        <Space size="large">
          <SearchInput
            defaultValue={historyPageState?.search}
            onChange={(e) => onChangeSearch("search", e.target.value)}
            className="master"
            placeholder={t("searchModulePlaceholder")}
          />
          <Button type="primary" onClick={() => navigate("/modules/create")}>
            {t("createNewModule")}
          </Button>
        </Space>
      </ContentHeader>

      <ZebraTable
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        onChange={onChange}
        rowKey="id"
        className="clickable"
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/modules/${record.id}`);
            },
          };
        }}
        columns={[
          {
            title: t("moduleStatus"),
            dataIndex: "published",
            width: 120,
            align: "center",
            render: (h) => <StatusTag value={h} />,
          },
          {
            title: t("moduleNumber"),
            dataIndex: "number",
            width: 150,
          },
          {
            title: t("moduleName"),
            dataIndex: "name",
          },
          {
            title: t("moduleTheme"),
            dataIndex: "topic",
            render: (h) => t(ModuleTopic[h as keyof typeof ModuleTopic]),
          },
        ]}
      />
    </>
  );
};

export default Modules;
