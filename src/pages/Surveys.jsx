import React from "react";
import { Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import WithPage from "@/components/WithPage";
import ContentHeader from "@/components/ContentHeader";
import ZebraTable from "@/components/ZebraTable";
import StatusTag from "@/components/StatusTag";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SurveysContent({ loadData, onChangeSearch, ...props }) {
  const navigate = useNavigate();
  const { t } = useTranslation("surveys");

  return (
    <>
      <ContentHeader title={t("surveyManagement")}>
        <Space size="large">
          {/* <SearchInput
            onChange={(e) => onChangeSearch("search", e.target.value)}
            className="master"
            placeholder={t("searchSurveyPlaceholder")}
          /> */}
          <Button type="primary" onClick={() => navigate("/surveys/create")}>
            {t("createNewSurvey")}
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
}

const Surveys = WithPage(SurveysContent, "/admin/questionnaires?sort=id,desc");
export default Surveys;
