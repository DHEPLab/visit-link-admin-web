// open a new modal, assign chw to supervisor
import AssignModalTable from "@/components/AssignModalTable";
import { debounce } from "radash";
import axios from "axios";
import React, { useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { useTranslation } from "react-i18next";

interface NotAssignedChwModalProps {
  id?: string;
  visible: boolean;
  onCancel: () => void;
  onFinish: () => void;
}

const NotAssignedChwModal: React.FC<NotAssignedChwModalProps> = ({ id, visible, onCancel, onFinish }) => {
  const { t } = useTranslation(["user", "common"]);
  const [dataSource, refresh] = useFetch(`/admin/users/supervisor/not_assigned/chw`, {}, []);

  useEffect(() => {
    if (visible) {
      refresh();
    }
    // eslint-disable-next-line
  }, [visible]);

  async function handleAssign(chwIds: React.Key[]) {
    await axios.post(`/admin/users/supervisor/${id}/chw`, chwIds);
    refresh();
    onFinish();
    onCancel();
  }

  const debounceRefresh = debounce({ delay: 400 }, (_, search) => refresh({ search }));

  return (
    <AssignModalTable
      visible={visible}
      onCancel={onCancel}
      onFinish={handleAssign}
      dataSource={dataSource}
      title={t("assignNewChw")}
      onChangeSearch={debounceRefresh}
      columns={[
        {
          title: t("chw"),
          dataIndex: "realName",
        },
        {
          title: t("id"),
          dataIndex: ["chw", "identity"],
        },
        {
          title: t("area"),
          dataIndex: ["chw", "tags"],
          render: (tags) => tags && tags.join(", "),
        },
      ]}
    />
  );
};

export default NotAssignedChwModal;
