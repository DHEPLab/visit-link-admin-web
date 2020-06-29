import React, { useState } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Form, Space, Button, Input } from 'antd';

import Rules from '../constants/rules';
import { Card, DetailHeader, SelectEnum } from '../components/*';
import { Text, Media } from '../components/curriculum/*';
import { Formik, Field, FieldArray, Form as FormikForm } from 'formik';

export default function Component() {
  const history = useHistory();
  const [form] = Form.useForm();
  const [components] = useState([
    {
      type: 'Text',
      key: '1',
      value: { type: '1', html: '<p>Hello</p>' },
    },
    {
      type: 'Text',
      key: '2',
      value: { type: '2', html: '<p>Hello</p>' },
    },
  ]);

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
        <Formik initialValues={{ components }}>
          {({ values }) => (
            <FormikForm>
              <FieldArray name="components">
                {(helpers) => (
                  <>
                    {values.components.map((component, index) => (
                      <Field key={component.key} name={`components.${index}.value`} as={Text} />
                    ))}
                  </>
                )}
              </FieldArray>
              {/* <Field name="text" as={Text} />
              <Field name="media" as={Media} /> */}
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
