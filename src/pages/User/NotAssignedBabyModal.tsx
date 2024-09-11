import { usePagination } from "@/hooks/usePagination";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import AssignModalTable from "@/components/AssignModalTable";

type NotAssignedBabyModalProps = {
  id?: string;
  visible: boolean;
  onFinish: VoidFunction;
  onCancel: VoidFunction;
};

// open a new modal, assign chw to supervisor
const NotAssignedBabyModal: React.FC<NotAssignedBabyModalProps> = ({ id, onFinish, onCancel, visible }) => {
  const { t } = useTranslation(["user", "common"]);
  const { loading, dataSource, pagination, loadData, onChange } = usePagination({
    apiRequestUrl: "/admin/users/chw/not_assigned/babies",
  });

  useEffect(() => {
    const abortController = new AbortController();
    if (visible) loadData?.(abortController.signal);
    return () => abortController.abort();
  }, [visible, loadData]);

  async function handleAssign(babyIds: React.Key[]) {
    await axios.post(`/admin/users/chw/${id}/babies`, babyIds);
    loadData?.();
    onFinish();
    onCancel();
  }

  return (
    <AssignModalTable
      loading={loading}
      dataSource={dataSource}
      pagination={pagination}
      onChange={onChange}
      title={t("assignBaby")}
      visible={visible}
      onCancel={onCancel}
      onFinish={handleAssign}
      columns={[
        {
          title: t("babyName"),
          dataIndex: "name",
          width: 100,
        },
        {
          title: t("id"),
          dataIndex: "identity",
          width: 120,
        },
        {
          title: t("area"),
          dataIndex: "area",
          width: 300,
        },
      ]}
    />
  );
};

export default NotAssignedBabyModal;
