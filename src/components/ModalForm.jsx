import React, { useEffect } from "react";
import { Form, Modal, Space, Button } from "antd";
import { useTranslation } from "react-i18next";

export default function ModalForm({
  width = 600,
  labelCol = { span: 6 },
  title,
  visible,
  onCancel,
  onFinish,
  initialValues = {},
  children,
  validateMessages,
}) {
  const { t } = useTranslation(["common"]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue(initialValues);
    }
  }, [visible, form, initialValues]);

  return (
    <Modal
      width={width}
      closable={false}
      maskClosable={false}
      destroyOnClose
      title={title}
      open={visible}
      footer={
        <Space size="large">
          <Button ghost type="primary" size="large" onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button type="primary" size="large" onClick={form.submit}>
            {t("submit")}
          </Button>
        </Space>
      }
    >
      <Form form={form} labelCol={labelCol} onFinish={onFinish} validateMessages={validateMessages}>
        {children}
      </Form>
    </Modal>
  );
}
