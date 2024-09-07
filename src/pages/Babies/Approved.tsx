import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import { Space } from "antd";
import SearchInput from "@/components/SearchInput";
import type { ZebraTableProps } from "@/components/ZebraTable";
import ZebraTable from "@/components/ZebraTable";
import StatusTag from "@/components/StatusTag";
import SearchBar from "./SearchBar";
import { Gender } from "@/constants/enums";
import dayjs from "dayjs";
import WithPage, { WithPageProps } from "@/components/WithPage";
import { useNavigate } from "react-router-dom";
import useTableSort from "./useTableSort";

type ApprovedProps = ZebraTableProps &
  WithPageProps & {
    refreshKey: number;
  };

const Approved: React.FC<ApprovedProps> = ({
  historyPageState,
  refreshKey,
  loadData,
  onChangeSearch,
  onChangePage,
  ...props
}) => {
  const { t } = useTranslation("babies");
  const navigate = useNavigate();
  useEffect(() => {
    loadData();
  }, [refreshKey, loadData]);

  const { sorterFun } = useTableSort({ onChangePage, onChangeSearch });

  return (
    <>
      <SearchBar>
        <Space size="large">
          <SearchInput
            defaultValue={historyPageState?.search}
            className="master"
            placeholder={t("searchBabyInputPlaceholder")}
            onChange={(e) => onChangeSearch("search", e.target.value)}
          />
        </Space>
      </SearchBar>
      <ZebraTable
        {...props}
        rowKey="id"
        className="clickable"
        onRow={(record) => ({
          onClick: () => {
            navigate(`/babies/${record.id}`);
          },
        })}
        onChange={sorterFun}
        scroll={{ x: "100vw" }}
        columns={[
          {
            title: t("babyStatus"),
            dataIndex: "deleted",
            align: "center",
            width: 100,
            render: (h) => <StatusTag value={!h} trueText={t("active")} falseText={t("archive")} />,
          },
          {
            title: t("registerDate"),
            dataIndex: "createdAt",
            className: "sort-column-vertical-center",
            align: "center",
            sorter: true,
            width: 150,
            render: (h) => dayjs(h).format("YYYY-MM-DD"),
          },
          {
            title: t("babyName"),
            dataIndex: "name",
            className: "sort-column-vertical-center",
            width: 140,
            sorter: true,
          },
          {
            title: t("id"),
            width: 200,
            dataIndex: "identity",
          },
          {
            title: t("gender"),
            width: 80,
            dataIndex: "gender",
            render: (h) => Gender[h as keyof typeof Gender],
          },
          {
            title: t("area"),
            dataIndex: "area",
            width: 300,
          },
          {
            title: t("chw"),
            dataIndex: "chw",
            width: 150,
          },
          {
            title: t("completedSession"),
            dataIndex: "visitCount",
            width: 150,
            render: (h) => `${h} ${t("sessions")}`,
          },
          {
            title: t("currentProgress"),
            dataIndex: "currentLessonName",
            width: 200,
          },
        ]}
      />
    </>
  );
};

const PageApproved = WithPage(Approved, "/admin/babies/approved", {}, false);
export default PageApproved;
