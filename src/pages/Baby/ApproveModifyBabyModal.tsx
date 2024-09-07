import { useTranslation } from "react-i18next";
import { Button, Modal, Space } from "antd";
import React, { MouseEventHandler } from "react";

interface ApproveModifyBabyModalProps {
  visible?: boolean;
  onCancel?: MouseEventHandler;
  onFinish?: MouseEventHandler;
}

const ApproveModifyBabyModal: React.FC<ApproveModifyBabyModalProps> = ({ visible, onCancel, onFinish }) => {
  const { t } = useTranslation("baby");
  return (
    <Modal
      title={t("modifyBabyTitle")}
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      footer={
        <Space size="large">
          <Button ghost danger onClick={onCancel}>
            {t("later")}
          </Button>
          <Button danger type="primary" onClick={onFinish}>
            {t("approve")}
          </Button>
        </Space>
      }
      open={visible}
    >
      <p>{t("approveModifyTip")}</p>
    </Modal>
  );
};

export default ApproveModifyBabyModal;
