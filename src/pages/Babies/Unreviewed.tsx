import SearchInput from "@/components/SearchInput";
import ZebraTable, { type ZebraTableProps } from "@/components/ZebraTable";
import { ActionFromApp, Gender } from "@/constants/enums";
import { usePagination } from "@/hooks/usePagination";
import { ApprovedOrReviewedBaby } from "@/models/res/Baby";
import isPropValid from "@emotion/is-prop-valid";
import { Space } from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SearchBar from "./SearchBar";
import useTableSort from "./useTableSort";

type ApprovedProps = ZebraTableProps & {
  refreshKey: number;
};

const Unreviewed: React.FC<ApprovedProps> = ({ refreshKey }) => {
  const { t } = useTranslation("babies");
  const navigate = useNavigate();
  const { historyPageState, loading, dataSource, pagination, loadData, onChangePage, onChangeSearch } =
    usePagination<ApprovedOrReviewedBaby>({
      apiRequestUrl: "/admin/babies/unreviewed",
      loadOnMount: false,
    });

  useEffect(() => {
    loadData();
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
            title: t("lastModifyAt"),
            dataIndex: "lastModifiedAt",
            align: "center",
            className: "sort-column-vertical-center",
            width: 220,
            sorter: true,
            render: (h, baby) => {
              return (
                <>
                  {dayjs(h).format("YYYY-MM-DD")}
                  <Tag actionFromApp={baby.actionFromApp}>
                    {ActionFromApp[baby.actionFromApp as keyof typeof ActionFromApp]}
                  </Tag>
                </>
              );
            },
          },
          {
            title: t("babyName"),
            className: "sort-column-vertical-center",
            dataIndex: "name",
            width: 120,
            sorter: true,
          },
          {
            title: t("id"),
            width: 200,
            dataIndex: "identity",
            render: (h) => h || t("pending"),
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
            title: t("registerDate"),
            dataIndex: "createdAt",
            align: "center",
            width: 150,
            render: (h) => dayjs(h).format("YYYY-MM-DD"),
          },
        ]}
      />
    </>
  );
};

const Tag = styled.span.withConfig({
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== "actionFromApp",
})<{ actionFromApp: string | null }>`
  ${(props) => {
    switch (props.actionFromApp) {
      case "CREATE":
        return `color: #ff794f; background: #ffede2`;
      case "MODIFY":
        return `color: #FF5555; background: #fff1f0`;
      default:
        return `color: #97979C; background: #EEEEEE`;
    }
  }};
  border-radius: 4px;
  padding: 3px 6px;
  margin-left: 20px;
  font-weight: bold;
  display: inline-block;
`;

export default Unreviewed;
