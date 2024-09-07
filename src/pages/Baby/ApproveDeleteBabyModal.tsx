import { useTranslation } from "react-i18next";
import { Button, Modal, Space } from "antd";
import React, { MouseEventHandler } from "react";

interface ApproveDeleteBabyModalProps {
  visible?: boolean;
  onCancel?: MouseEventHandler;
  onFinish?: MouseEventHandler;
}

const ApproveDeleteBabyModal: React.FC<ApproveDeleteBabyModalProps> = ({ visible, onCancel, onFinish }) => {
  const { t } = useTranslation("baby");
  return (
    <Modal
      title={t("archiveBabyTitle")}
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
      <p>{t("approveArchiveTip")}</p>
    </Modal>
  );
};

export default ApproveDeleteBabyModal;
