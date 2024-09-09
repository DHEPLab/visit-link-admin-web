import WithPage, { WithPageProps } from "@/components/WithPage";
import { useTranslation } from "react-i18next";
import React, { useEffect } from "react";
import ZebraTable from "@/components/ZebraTable";
import { phone, realName, username } from "./tableColumnConfig";
import { useNavigate } from "react-router-dom";

type SupervisorProps = WithPageProps & {
  tab: string;
};

const Supervisor: React.FC<SupervisorProps> = ({ tab, loadData, ...props }) => {
  const { t } = useTranslation(["users", "common"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (tab === "supervisor") {
      loadData();
    }
  }, [tab, loadData]);

  return (
    <div>
      <ZebraTable
        {...props}
        scroll={{ x: true }}
        className="clickable"
        rowKey={(record) => record.user.id}
        onRow={(record) => ({
          onClick: () => {
            navigate(`/users/${record.user.id}`);
          },
        })}
        columns={[
          realName,
          phone,
          {
            title: t("chw"),
            dataIndex: "chwCount",
            width: 200,
            render: (h) => `${h} ${t("unit.person", { ns: "common" })}`,
          },
          username,
        ]}
      />
    </div>
  );
};

const SupervisorTab = WithPage(Supervisor, "/admin/users/supervisor", {}, false);
export default SupervisorTab;
