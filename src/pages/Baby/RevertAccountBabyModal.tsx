import { useTranslation } from "react-i18next";
import { Button, Modal, Space } from "antd";
import React, { MouseEventHandler } from "react";

interface RevertAccountBabyModalProps {
  visible?: boolean;
  onCancel?: MouseEventHandler;
  onOk?: MouseEventHandler;
}

const RevertAccountBabyModal: React.FC<RevertAccountBabyModalProps> = ({ visible, onCancel, onOk }) => {
  const { t } = useTranslation("baby");
  return (
    <Modal
      title={t("reactiveBaby")}
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      footer={
        <Space size="large">
          <Button ghost danger onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button danger type="primary" onClick={onOk}>
            {t("reactive")}
          </Button>
        </Space>
      }
      open={visible}
    >
      <p>{t("reactiveBabyConfirm")}</p>
    </Modal>
  );
};

export default RevertAccountBabyModal;
