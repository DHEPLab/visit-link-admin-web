import React, { useEffect } from 'react';
import { Form, Modal, Space, Button } from 'antd';

export default function ({ title, visible, onCancel, onFinish, initialValues, children }) {
  const [form] = Form.useForm();

  useEffect(() => {
    visible && form.resetFields();
  }, [visible, form]);

  return (
    <Modal
      width={600}
      closable={false}
      maskClosable={false}
      destroyOnClose
      title={title}
      visible={visible}
      footer={
        <Space size="large">
          <Button ghost type="primary" size="large" onClick={onCancel}>
            放弃
          </Button>
          <Button type="primary" size="large" onClick={form.submit}>
            提交
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        labelCol={{ span: 4, offset: 1 }}
        wrapperCol={{ offset: 1 }}
        onFinish={onFinish}
        initialValues={initialValues}
      >
        {children}
      </Form>
    </Modal>
  );
}
