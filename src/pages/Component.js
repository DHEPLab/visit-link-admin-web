import React from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Form, Space, Button, Input } from 'antd';

import Rules from '../constants/rules';
import { Card, DetailHeader, SelectEnum } from '../components/*';
import { Text } from '../components/curriculum/*';
import { Formik, Field, Form as FormikForm } from 'formik';

export default function Component() {
  const [form] = Form.useForm();
  const history = useHistory();

  async function handleSave(values) {
    await Axios.post('/admin/component', values);
    history.goBack();
  }

  return (
    <>
      <DetailHeader
        menu="模块管理"
        title="创建新模块"
        extra={
          <Space size="large">
            <Button ghost type="danger">
              保存至草稿
            </Button>
            <Button type="danger" onClick={form.submit}>
              保存并发布
            </Button>
          </Space>
        }
      ></DetailHeader>

      <Card title="模块内容">
        <Formik initialValues={{ text: { type: '', html: '<p>Hello</p>' }, firstName: '' }}>
          {({ values }) => (
            <FormikForm>
              <Field name="text" as={Text} />
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </FormikForm>
          )}
        </Formik>
      </Card>

      <Card title="模块基本信息">
        <Form form={form} onFinish={handleSave}>
          <Form.Item label="模块名称" name="name" rules={Rules.Required}>
            <Input />
          </Form.Item>
          <Form.Item label="模块编号" name="number" rules={Rules.Required}>
            <Input />
          </Form.Item>
          <Form.Item label="模块描述" name="description" rules={Rules.Required}>
            <Input />
          </Form.Item>
          <Form.Item label="模块主题" name="topic" rules={Rules.Required}>
            <SelectEnum name="ComponentTopic" />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
