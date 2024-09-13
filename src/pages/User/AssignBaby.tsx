import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useBoolState from "@/hooks/useBoolState";
import useFetch from "@/hooks/useFetch";
import axios from "axios";
import React, { useEffect } from "react";
import Card from "@/components/Card";
import { Button } from "antd";
import ZebraTable from "@/components/ZebraTable";
import { Gender } from "@/constants/enums";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import ShadeButton from "@/components/ShadeButton";
import NotAssignedBabyModal from "@/pages/User/NotAssignedBabyModal";
import { AssignBaby as AssignBabyModel } from "@/models/res/User";

interface AssignBabyProps {
  id?: string;
  onChange: (dataSource: AssignBabyModel[]) => void;
}

const AssignBaby: React.FC<AssignBabyProps> = ({ id, onChange }) => {
  const { t } = useTranslation(["user", "common"]);
  const navigate = useNavigate();
  const [visible, openModal, closeModal] = useBoolState(false);
  const [dataSource, refresh] = useFetch<AssignBabyModel[]>(`/admin/users/chw/${id}/babies`, {}, []);

  // release chw, set chw's supervisor to null
  function handleRelease(babyId: number) {
    axios.delete(`/admin/babies/${babyId}/chw`).then(() => refresh());
  }

  useEffect(() => {
    onChange(dataSource);
  }, [dataSource, onChange]);

  return (
    <Card title={t("babyList")} noPadding extra={<ShadeButton onClick={openModal}>{t("newBaby")}</ShadeButton>}>
      <ZebraTable
        rowKey="id"
        className="clickable"
        onRow={(record) => ({
          onClick: (event) => {
            // do noting when click other target
            if (event.target instanceof HTMLElement && event.target.tagName === "TD") {
              navigate(`/babies/${record.id}`);
            }
          },
        })}
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: t("babyName"),
            dataIndex: "name",
            width: 350,
            align: "center",
            ellipsis: true,
          },
          {
            title: t("id"),
            dataIndex: "identity",
          },
          {
            title: t("gender"),
            dataIndex: "gender",
            render: (h) => Gender[h as keyof typeof Gender],
            width: 100,
          },
          {
            title: t("master"),
            dataIndex: "masterCarerName",
            width: 350,
            ellipsis: true,
          },
          {
            title: t("phone"),
            dataIndex: "masterCarerPhone",
          },
          {
            title: t("operation"),
            dataIndex: "id",
            width: 200,
            align: "center",
            render(babyId: number) {
              return (
                <DeleteConfirmModal
                  title={t("unbindBaby")}
                  content={t("unbindBabyMessage")}
                  onConfirm={() => handleRelease(babyId)}
                  okText={t("unbind")}
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
      <NotAssignedBabyModal id={id} onFinish={refresh} visible={visible} onCancel={closeModal} />
    </Card>
  );
};

export default AssignBaby;
