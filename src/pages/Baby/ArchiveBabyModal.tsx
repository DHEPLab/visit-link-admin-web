import { useTranslation } from "react-i18next";
import { Button, Form, Input, Modal, Space } from "antd";
import Rules from "@/constants/rules.ts";
import React, { MouseEventHandler } from "react";

export interface ArchiveBabyFormValues {
  reason: string;
}

interface ArchiveBabyModalProps {
  visible?: boolean;
  onCancel?: MouseEventHandler;
  onOk: (values: ArchiveBabyFormValues) => void;
}

const ArchiveBabyModal: React.FC<ArchiveBabyModalProps> = ({ visible, onCancel, onOk }) => {
  const { t } = useTranslation(["baby", "common"]);
  const [form] = Form.useForm();

  return (
    <Modal
      title={t("archiveBaby")}
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      footer={
        <Space size="large">
          <Button ghost danger onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button danger type="primary" onClick={form.submit}>
            {t("archive")}
          </Button>
        </Space>
      }
      open={visible}
    >
      <p>{t("archiveTip")}</p>
      <Form<ArchiveBabyFormValues> form={form} onFinish={onOk} labelCol={{ span: 0 }}>
        <Form.Item label={t("archiveReason")} name="reason" rules={Rules.Required}>
          <Input style={{ width: "100%" }} placeholder={`${t("enter", { ns: "common" })}${t("archiveReason")}`} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ArchiveBabyModal;
