import ShadeButton from "@/components/ShadeButton";
import ZebraTable from "@/components/ZebraTable";
import { Gender } from "@/constants/enums";
import useBoolState from "@/hooks/useBoolState";
import { usePagination } from "@/hooks/usePagination";
import { InfoCircleFilled } from "@ant-design/icons";
import { Button, Modal, Tooltip } from "antd";
import axios from "axios";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import CurriculumBabiesAssignTableModal from "./CurriculumBabiesAssignTableModal";

type CurriculumBabiesModalProps = {
  curriculumId: number;
  visible: boolean;
  onCancel: VoidFunction;
};

const CurriculumBabiesModal: React.FC<CurriculumBabiesModalProps> = ({ curriculumId, visible, onCancel }) => {
  const { t } = useTranslation("curriculums");
  const [assign, openModal, closeModal] = useBoolState();

  const { dataSource, pagination, loadData } = usePagination({
    apiRequestUrl: `/admin/curriculums/${curriculumId}/babies`,
  });

  function handleAssign(babyIds: React.Key[]) {
    axios.post(`/admin/curriculums/${curriculumId}/babies`, babyIds).then(() => {
      loadData();
      closeModal();
    });
  }

  function handleReleaseBaby(id: number) {
    axios.delete(`/admin/babies/${id}/curriculum`).then(() => loadData());
  }

  return (
    <Modal
      title={t("babyList")}
      open={visible}
      onCancel={onCancel}
      width={1152}
      footer={null}
      styles={{ body: { padding: 0 } }}
      style={{ top: 20 }}
    >
      <ModalHeader>
        <Title>
          <label>{t("curriculumAssignedBabyList")}</label>
          <Tooltip title={t("babyAutoAssignTip")} placement="right">
            <InfoCircleFilled />
          </Tooltip>
        </Title>
        <ShadeButton onClick={openModal}>{t("addNewBaby")}</ShadeButton>
      </ModalHeader>
      <ZebraTable
        dataSource={dataSource}
        pagination={pagination}
        rowKey="id"
        columns={[
          {
            title: t("babyName"),
            dataIndex: "name",
            width: 100,
          },
          {
            title: t("ID"),
            dataIndex: "identity",
            width: 120,
          },
          {
            title: t("gender"),
            dataIndex: "gender",
            render: (h) => Gender[h as keyof typeof Gender],
            width: 80,
          },
          {
            title: t("area"),
            dataIndex: "area",
            width: 300,
          },
          {
            title: t("primaryCaregiver"),
            dataIndex: "masterCarerName",
            width: 120,
          },
          {
            title: t("contactPhone"),
            dataIndex: "masterCarerPhone",
            width: 120,
          },
          {
            title: t("action"),
            dataIndex: "id",
            width: 100,
            align: "center",
            render(id) {
              return (
                <Button type="link" size="small" onClick={() => handleReleaseBaby(id)}>
                  {t("delete")}
                </Button>
              );
            },
          },
        ]}
      />
      {assign && (
        <CurriculumBabiesAssignTableModal
          title={t("addNewBaby")}
          curriculumId={curriculumId}
          visible={assign}
          width={900}
          onCancel={closeModal}
          onFinish={handleAssign}
          columns={[
            {
              title: t("babyName"),
              dataIndex: "name",
              width: 500,
              ellipsis: true,
            },
            {
              title: "ID",
              dataIndex: "identity",
              width: 100,
            },
            {
              title: t("area"),
              dataIndex: "area",
              width: 200,
            },
          ]}
        />
      )}
    </Modal>
  );
};

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  height: 70px;
  border-bottom: 2px solid #eee;
`;

const Title = styled.div`
  display: flex;
  align-items: center;

  label {
    color: #4a4a4a;
    font-size: 20px;
    font-weight: bold;
    margin-right: 5px;
  }
`;

export default CurriculumBabiesModal;
