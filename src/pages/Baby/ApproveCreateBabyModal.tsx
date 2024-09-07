import { useTranslation } from "react-i18next";
import { Button, Form, Input, Modal, ModalProps, Space } from "antd";
import React, { MouseEventHandler, useEffect } from "react";
import Rules from "@/constants/rules";

export interface ApproveCreateBabyFormValues {
  identity: string;
}

type ApproveCreateBabyModalProps = {
  visible?: boolean;
  onCancel?: MouseEventHandler;
  onFinish?: (values: ApproveCreateBabyFormValues) => void;
} & ModalProps;

const ApproveCreateBabyModal: React.FC<ApproveCreateBabyModalProps> = ({ onCancel, onFinish, visible, ...props }) => {
  const { t } = useTranslation(["baby", "common"]);
  const [form] = Form.useForm();
  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  return (
    <Modal
      title={t("batchNewBabiesTitle")}
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      footer={
        <Space size="large">
          <Button ghost danger onClick={onCancel}>
            {t("later")}
          </Button>
          <Button danger type="primary" onClick={form.submit}>
            {t("approve")}
          </Button>
        </Space>
      }
      open={visible}
      {...props}
    >
      <p>{t("batchNewBabiesTip")}</p>
      <Form<ApproveCreateBabyFormValues> form={form} onFinish={onFinish} labelCol={{ span: 0 }}>
        <Form.Item label={t("id")} name="identity" rules={Rules.Required}>
          <Input autoFocus style={{ width: "100%" }} placeholder={`${t("enter", { ns: "common" })}${t("id")}`} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ApproveCreateBabyModal;
