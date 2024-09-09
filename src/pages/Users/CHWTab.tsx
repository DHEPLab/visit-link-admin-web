import WithPage, { WithPageProps } from "@/components/WithPage";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import SearchInput from "@/components/SearchInput";
import ZebraTable from "@/components/ZebraTable";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { phone, realName, username } from "./tableColumnConfig";

type CHWProps = WithPageProps & {
  tab: string;
};

const CHW: React.FC<CHWProps> = ({ historyPageState, tab, loadData, onChangeSearch, ...props }) => {
  const { t } = useTranslation(["users", "common"]);
  const navigate = useNavigate();
  useEffect(() => {
    if (tab === "chw") {
      loadData();
    }
  }, [tab, loadData]);

  return (
    <div>
      <ChwBar>
        <SearchInput
          defaultValue={historyPageState?.search}
          style={{ width: "420px" }}
          onChange={(e) => onChangeSearch("search", e.target.value)}
          placeholder={t("searchChwPlaceholder")}
        />
      </ChwBar>
      <ZebraTable
        {...props}
        className="clickable"
        scroll={{ x: true }}
        rowKey={(record) => record.user.id}
        onRow={(record) => ({
          onClick: () => {
            navigate(`/users/${record.user.id}`);
          },
        })}
        columns={[
          realName,
          {
            title: t("id"),
            width: 150,
            dataIndex: ["user", "chw", "identity"],
          },
          {
            title: t("area"),
            width: 350,
            dataIndex: ["user", "chw", "tags"],
            render: (tags) => tags && tags.join(", "),
          },
          phone,
          {
            title: t("supervisor"),
            width: 120,
            dataIndex: ["user", "chw", "supervisor", "realName"],
          },
          {
            title: t("babyCount"),
            width: 100,
            dataIndex: "babyCount",
            render: (h) => `${h} ${t("unit.person", { ns: "common" })}`,
          },
          username,
          {
            title: t("completion"),
            width: 120,
            dataIndex: "hasFinish",
            render: (hasFinish, v) => `${hasFinish} / ${v.shouldFinish}`,
          },
          {
            title: t("completionRate"),
            width: 100,
            dataIndex: "shouldFinish",
            render: (shouldFinish, v) => {
              const percent = Number(Number((v.hasFinish / shouldFinish) * 100).toFixed(2));
              return `${shouldFinish === 0 ? 0 : percent}%`;
            },
          },
        ]}
      />
    </div>
  );
};

const ChwBar = styled.div`
  height: 76px;
  padding-left: 30px;
  padding-right: 20px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ffc3a0;
`;

const CHWTab = WithPage(CHW, "/admin/users/chw", {}, false);
export default CHWTab;
