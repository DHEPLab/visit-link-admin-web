import ZebraTable from "@/components/ZebraTable";
import { usePagination } from "@/hooks/usePagination";
import { User } from "@/models/res/User";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { phone, realName, username } from "./tableColumnConfig";

type AdminProps = {
  refreshKey: number;
};

const AdminTab: React.FC<AdminProps> = ({ refreshKey }) => {
  const navigate = useNavigate();
  const { loading, dataSource, pagination, loadData, onChange } = usePagination<User>({
    apiRequestUrl: "/admin/users/admin",
    apiRequestParams: {
      sort: "id,desc",
    },
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
        rowKey="id"
        className="clickable"
        onRow={(record) => ({
          onClick: () => {
            navigate(`/users/${record.id}`);
          },
        })}
        columns={[
          { ...realName, dataIndex: "realName" },
          { ...phone, dataIndex: "phone" },
          { ...username, dataIndex: "username" },
        ]}
      />
    </div>
  );
};

export default AdminTab;
