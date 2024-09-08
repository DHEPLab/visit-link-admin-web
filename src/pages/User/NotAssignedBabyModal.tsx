import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import AssignModalTable from "@/components/AssignModalTable";
import { WithPageProps } from "@/components/WithPage";

type NotAssignedBabyModalProps = WithPageProps & {
  id?: string;
  visible: boolean;
  onFinish: VoidFunction;
  onCancel: VoidFunction;
};

// open a new modal, assign chw to supervisor
const NotAssignedBabyModal: React.FC<NotAssignedBabyModalProps> = ({
  id,
  onFinish,
  onCancel,
  visible,
  loadData,
  ...props
}) => {
  const { t } = useTranslation(["user", "common"]);
  useEffect(() => {
    if (visible) loadData?.();
    // eslint-disable-next-line
  }, [visible]);

  async function handleAssign(babyIds: React.Key[]) {
    await axios.post(`/admin/users/chw/${id}/babies`, babyIds);
    loadData?.();
    onFinish();
    onCancel();
  }

  return (
    <AssignModalTable
      {...props}
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
