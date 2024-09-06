import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import { Space } from "antd";
import SearchInput from "@/components/SearchInput";
import ZebraTable, { type ZebraTableProps } from "@/components/ZebraTable";
import { ActionFromApp, Gender } from "@/constants/enums";
import WithPage, { WithPageProps } from "@/components/WithPage";
import styled from "styled-components";
import { NavigateFunction } from "react-router-dom";
import SearchBar from "./SearchBar";
import dayjs from "dayjs";
import useTableSort from "./useTableSort";

type ApprovedProps = ZebraTableProps &
  WithPageProps & {
    tab: string;
    navigate: NavigateFunction;
  };

const Unreviewed: React.FC<ApprovedProps> = ({
  historyPageState,
  onChangeSearch,
  onChangePage,
  tab,
  navigate,
  loadData,
  ...props
}) => {
  const { t } = useTranslation("babies");
  useEffect(() => {
    if (tab === "unreviewed") {
      loadData();
    }
  }, [tab, loadData]);

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

const Tag = styled.span<{ actionFromApp: "CREATE" | "MODIFY" }>`
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

const PageUnreviewed = WithPage(Unreviewed, "/admin/babies/unreviewed", {}, false);
export default PageUnreviewed;
