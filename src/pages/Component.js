import React, { useState } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Form, Space, Button, Input } from 'antd';

import Rules from '../constants/rules';
import { Card, DetailHeader, SelectEnum } from '../components/*';
import { ComponentField } from '../components/curriculum/*';
import { Formik, FieldArray, Form as FormikForm } from 'formik';
import styled from 'styled-components';

export default function Component() {
  const history = useHistory();
  const [form] = Form.useForm();
  const [components] = useState([
    {
      type: 'Text',
      key: 1,
      value: { type: '1', html: '<p>Hello</p>' },
    },
    {
      type: 'Text',
      key: 2,
      value: { type: '2', html: '<p>Hello</p>' },
    },
    {
      type: 'Media',
      key: 3,
      value: { type: 'video', file: 'abc.mp4', alt: 'test video' },
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
            <>
              <FieldArray name="components">
                {(helpers) => (
                  <FieldArrayContainer>
                    <ComponentForm>
                      {values.components.map((component, index) => (
                        <ComponentField
                          key={component.key}
                          name="components"
                          component={component}
                          index={index}
                          arrayHelpers={helpers}
                        />
                      ))}
                    </ComponentForm>
                    <ComponentToolBar>
                      <Button type="link">添加文本组件</Button>
                      <Button type="link">添加媒体组件</Button>
                    </ComponentToolBar>
                  </FieldArrayContainer>
                )}
              </FieldArray>
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </>
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

const FieldArrayContainer = styled.div`
  display: flex;
`;
const ComponentForm = styled.div``;
const ComponentToolBar = styled.div``;
