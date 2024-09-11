import SearchInput from "@/components/SearchInput";
import StatusTag from "@/components/StatusTag";
import type { ZebraTableProps } from "@/components/ZebraTable";
import ZebraTable from "@/components/ZebraTable";
import { Gender } from "@/constants/enums";
import { usePagination } from "@/hooks/usePagination";
import { ApprovedOrReviewedBaby } from "@/models/res/Baby";
import { Space } from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import useTableSort from "./useTableSort";

type ApprovedProps = ZebraTableProps & {
  refreshKey: number;
};

const Approved: React.FC<ApprovedProps> = ({ refreshKey }) => {
  const { t } = useTranslation("babies");
  const navigate = useNavigate();
  const { historyPageState, loading, dataSource, pagination, loadData, onChangePage, onChangeSearch } =
    usePagination<ApprovedOrReviewedBaby>({
      apiRequestUrl: "/admin/babies/approved",
      loadOnMount: false,
    });

  useEffect(() => {
    const abortController = new AbortController();
    loadData(abortController.signal);
    return () => abortController.abort();
  }, [refreshKey, loadData]);

  const { sorterFun } = useTableSort<ApprovedOrReviewedBaby>({ onChangePage, onChangeSearch });

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
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
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

export default Approved;
