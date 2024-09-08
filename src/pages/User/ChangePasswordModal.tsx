import { useTranslation } from "react-i18next";
import { Button, Form, FormProps, Input, Modal, ModalProps, Space } from "antd";
import React, { useEffect } from "react";
import axios from "axios";
import Rules from "@/constants/rules";

type ChangePasswordModalProps = {
  id?: string;
  visible: boolean;
  onCancel: VoidFunction;
} & ModalProps;

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ id, onCancel, visible, ...props }) => {
  const { t } = useTranslation(["user", "common"]);
  const [form] = Form.useForm();
  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  function onFinish(values: { password: string }) {
    axios.put(`/admin/users/${id}/password`, values).then(onCancel);
  }

  return (
    <Modal
      title={t("confirmResetPassword")}
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      footer={
        <Space size="large">
          <Button ghost danger onClick={onCancel}>
            {t("cancel", { ns: "common" })}
          </Button>
          <Button danger type="primary" onClick={form.submit}>
            {t("confirm", { ns: "common" })}
          </Button>
        </Space>
      }
      open={visible}
      {...props}
    >
      <p>{t("resetPasswordMessage")}</p>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 0 }}
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true }) as FormProps["validateMessages"]}
      >
        <Form.Item label={t("newPassword")} name="password" rules={Rules.Password}>
          <Input.Password style={{ width: "100%" }} placeholder={t("enter", { ns: "common" }) + t("newPassword")} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
