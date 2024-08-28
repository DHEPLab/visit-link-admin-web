import React from "react";
import { Button, Space } from "antd";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { WithPage, ContentHeader, ZebraTable, StatusTag } from "../components";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Surveys({ loadData, onChangeSearch, ...props }) {
  const history = useHistory();
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
          <Button type="primary" onClick={() => history.push("/surveys/create")}>
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
              history.push(`/surveys/${record.id}`);
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

export default WithPage(Surveys, "/admin/questionnaires?sort=id,desc");
