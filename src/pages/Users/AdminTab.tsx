import WithPage, { WithPageProps } from "@/components/WithPage";
import React, { useEffect } from "react";
import ZebraTable from "@/components/ZebraTable";
import { phone, realName, username } from "./tableColumnConfig";
import { useNavigate } from "react-router-dom";

type AdminProps = WithPageProps & {
  refreshKey: number;
};

const Admin: React.FC<AdminProps> = ({ refreshKey, loadData, ...props }) => {
  const navigate = useNavigate();
  useEffect(() => {
    loadData();
  }, [refreshKey, loadData]);

  return (
    <div>
      <ZebraTable
        {...props}
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

const AdminTab = WithPage(Admin, "/admin/users/admin?sort=id,desc", {}, false);
export default AdminTab;
