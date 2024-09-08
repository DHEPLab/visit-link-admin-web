import { useTranslation } from "react-i18next";
import useBoolState from "@/hooks/useBoolState";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import Card from "@/components/Card";
import { Button } from "antd";
import ZebraTable from "@/components/ZebraTable";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import React from "react";
import NotAssignedChwModal from "@/pages/User/NotAssignedChwModal";
import ShadeButton from "@/components/ShadeButton";
import { User } from "@/models/res/User";

const AssignChw: React.FC<{ id?: string }> = ({ id }) => {
  const { t } = useTranslation(["user", "common"]);
  const [visible, openModal, closeModal] = useBoolState();
  const [dataSource, refresh] = useFetch<User[]>(`/admin/users/supervisor/${id}/chw`, {}, []);

  // release chw, set chw's supervisor to null
  function handleRelease(chwId: number) {
    axios.delete(`/admin/users/chw/${chwId}/supervisor`).then(() => refresh());
  }

  return (
    <Card title={t("chw")} noPadding extra={<ShadeButton onClick={openModal}>{t("assignChw")}</ShadeButton>}>
      <ZebraTable
        rowKey="id"
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: t("name"),
            dataIndex: "realName",
            width: 180,
            align: "center",
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
          {
            title: t("phone"),
            dataIndex: "phone",
          },
          {
            title: t("operation"),
            dataIndex: "id",
            width: 200,
            align: "center",
            render(chwId: number) {
              return (
                <DeleteConfirmModal
                  title={t("unbindChw")}
                  content={t("unbindChwMessage")}
                  okText={t("unbind")}
                  onConfirm={() => handleRelease(chwId)}
                >
                  <Button size="small" type="link">
                    {t("unbind")}
                  </Button>
                </DeleteConfirmModal>
              );
            },
          },
        ]}
      />
      <NotAssignedChwModal id={id} onFinish={refresh} visible={visible} onCancel={closeModal} />
    </Card>
  );
};

export default AssignChw;
