import ZebraTable from "@/components/ZebraTable";
import { usePagination } from "@/hooks/usePagination";
import { Supervisor } from "@/models/res/User";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { phone, realName, username } from "./tableColumnConfig";

type SupervisorProps = {
  refreshKey: number;
};

const SupervisorTab: React.FC<SupervisorProps> = ({ refreshKey }) => {
  const { t } = useTranslation(["users", "common"]);
  const navigate = useNavigate();

  const { loading, dataSource, pagination, loadData, onChange } = usePagination<Supervisor>({
    apiRequestUrl: "/admin/users/supervisor",
    loadOnMount: false,
  });

  useEffect(() => {
    const abortController = new AbortController();
    loadData(abortController.signal);
    return () => abortController.abort();
  }, [refreshKey, loadData]);

  return (
    <div>
      <ZebraTable
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        onChange={onChange}
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

export default SupervisorTab;
