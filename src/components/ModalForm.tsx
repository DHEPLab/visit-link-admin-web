import { PropsWithChildren, useEffect } from "react";
import { Form, Modal, Space, Button, ColProps, FormProps } from "antd";
import { useTranslation } from "react-i18next";

export interface ModalFormProps<T> extends PropsWithChildren {
  width?: number;
  labelCol?: ColProps;
  title: string;
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: T) => void;
  initialValues?: T;
  validateMessages?: FormProps["validateMessages"];
}

const ModalForm = <T,>({
  width = 600,
  labelCol = { span: 6 },
  title,
  visible,
  onCancel,
  onFinish,
  initialValues = {} as T,
  children,
  validateMessages,
}: ModalFormProps<T>) => {
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
};

export default ModalForm;
