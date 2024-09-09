import React from "react";
import { Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ModuleTopic } from "@/constants/enums";
import WithPage, { WithPageProps } from "@/components/WithPage";
import ContentHeader from "@/components/ContentHeader";
import ZebraTable from "@/components/ZebraTable";
import SearchInput from "@/components/SearchInput";
import StatusTag from "@/components/StatusTag";

type ModulesContentProps = WithPageProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ModulesContent: React.FC<ModulesContentProps> = ({ historyPageState, loadData, onChangeSearch, ...props }) => {
  const { t } = useTranslation("modules");
  const navigate = useNavigate();

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
        {...props}
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

const Modules = WithPage(ModulesContent, "/admin/modules");
export default Modules;
