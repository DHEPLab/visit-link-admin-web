import { Curriculum } from "@/models/res/Curriculum";
import React, { useState } from "react";
import { Button, Space } from "antd";
import { useTranslation } from "react-i18next";
import StatusTag from "@/components/StatusTag";
import ContentHeader from "@/components/ContentHeader";
import ZebraTable from "@/components/ZebraTable";
import SearchInput from "@/components/SearchInput";
import { useNavigate } from "react-router-dom";
import PageCurriculumBabiesModal from "./CurriculumBabiesModal";
import { usePagination } from "@/hooks/usePagination";

const Curriculums: React.FC = () => {
  const navigate = useNavigate();
  const [curriculumId, setCurriculumId] = useState<number>(-1);
  const { t } = useTranslation("curriculums");
  const { historyPageState, loading, pagination, dataSource, onChange, onChangeSearch } = usePagination<Curriculum>({
    apiRequestUrl: "/admin/curriculums",
    apiRequestParams: {
      sort: "id,desc",
    },
  });

  function startAssignBaby(id: number) {
    setCurriculumId(id);
  }

  return (
    <>
      <ContentHeader title={t("curriculumManagement")}>
        <Space size="large">
          <SearchInput
            defaultValue={historyPageState?.search}
            onChange={(e) => onChangeSearch("search", e.target.value)}
            className="master"
            placeholder={t("searchByCurriculumName")}
          />
          <Button type="primary" onClick={() => navigate("/curriculums/create")}>
            {t("createNewCurriculum")}
          </Button>
        </Space>
      </ContentHeader>

      <ZebraTable
        loading={loading}
        pagination={pagination}
        dataSource={dataSource}
        rowKey="id"
        className="clickable"
        onChange={onChange}
        onRow={(record) => {
          return {
            onClick: (event) => {
              // do noting when click other target
              if (event.target instanceof HTMLElement && event.target.tagName === "TD") {
                navigate(`/curriculums/${record.id}`);
              }
            },
          };
        }}
        columns={[
          {
            title: t("curriculumStatus"),
            dataIndex: "published",
            width: 120,
            align: "center",
            render: (h) => <StatusTag value={h} />,
          },
          {
            title: t("curriculumName"),
            dataIndex: "name",
          },
          {
            title: t("action"),
            dataIndex: "id",
            width: 200,
            align: "center",
            render(id) {
              return (
                <Button type="link" size="small" onClick={() => startAssignBaby(id)}>
                  {t("assignBaby")}
                </Button>
              );
            },
          },
        ]}
      />

      {curriculumId > 0 && (
        <PageCurriculumBabiesModal
          curriculumId={curriculumId}
          visible={curriculumId > 0}
          onCancel={() => setCurriculumId(-1)}
        />
      )}
    </>
  );
};

export default Curriculums;
