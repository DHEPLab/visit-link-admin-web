import AssignModalTable, { AssignModalTableProps } from "@/components/AssignModalTable";
import { usePagination } from "@/hooks/usePagination";
import { ChwUser } from "@/models/res/User";
import React from "react";

type PageAssignChwModalTableProps = AssignModalTableProps<ChwUser>;

const PageAssignChwModalTable: React.FC<PageAssignChwModalTableProps> = (props) => {
  const { loading, dataSource, pagination, onChange } = usePagination<ChwUser>({
    apiRequestUrl: "/admin/users/chw",
  });
  return (
    <AssignModalTable
      loading={loading}
      dataSource={dataSource}
      pagination={pagination}
      onChange={onChange}
      {...props}
    />
  );
};

export default PageAssignChwModalTable;
