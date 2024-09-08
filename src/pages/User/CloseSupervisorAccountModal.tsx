import { useTranslation } from "react-i18next";
import { Button, Modal, Space } from "antd";
import React, { MouseEventHandler } from "react";

interface CloseSupervisorAccountModalProps {
  visible: boolean;
  onCancel: MouseEventHandler;
  onFinish: MouseEventHandler;
}

const CloseSupervisorAccountModal: React.FC<CloseSupervisorAccountModalProps> = ({ visible, onCancel, onFinish }) => {
  const { t } = useTranslation(["user", "common"]);
  return (
    <Modal
      title={t("deleteSuperviser")}
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      open={visible}
      footer={
        <Space size="large">
          <Button ghost danger onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button danger type="primary" onClick={onFinish}>
            {t("delete")}
          </Button>
        </Space>
      }
    >
      <p>{t("deleteSuperviserMessage")}</p>
    </Modal>
  );
};

export default CloseSupervisorAccountModal;
