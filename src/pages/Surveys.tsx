import ContentHeader from "@/components/ContentHeader";
import StatusTag from "@/components/StatusTag";
import ZebraTable from "@/components/ZebraTable";
import { usePagination } from "@/hooks/usePagination";
import { Curriculum } from "@/models/res/Curriculum";
import { Button, Space } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Surveys: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("surveys");

  const { loading, pagination, dataSource, onChange } = usePagination<Curriculum>({
    apiRequestUrl: "/admin/questionnaires",
    apiRequestParams: {
      sort: "id,desc",
    },
  });

  return (
    <>
      <ContentHeader title={t("surveyManagement")}>
        <Space size="large">
          <Button type="primary" onClick={() => navigate("/surveys/create")}>
            {t("createNewSurvey")}
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
              navigate(`/surveys/${record.id}`);
            },
          };
        }}
        columns={[
          {
            title: t("surveyStatus"),
            dataIndex: "published",
            width: 120,
            align: "center",
            render: (h) => <StatusTag value={h} />,
          },
          {
            title: t("surveyName"),
            dataIndex: "name",
          },
        ]}
      />
    </>
  );
};

export default Surveys;
