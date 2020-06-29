import React, { useState } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Formik, FieldArray } from 'formik';
import { Form, Space, Button, Input } from 'antd';

import Rules from '../constants/rules';
import helpers from '../components/curriculum/helpers';
import { Card, DetailHeader, SelectEnum } from '../components/*';
import { ComponentField } from '../components/curriculum/*';

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
                {(arrays) => (
                  <FieldArrayContainer>
                    <ComponentForm>
                      {values.components.map((component, index) => (
                        <ComponentField
                          key={component.key}
                          name="components"
                          index={index}
                          onRemove={arrays.remove}
                          component={component}
                        />
                      ))}
                    </ComponentForm>
                    <ComponentToolBar>
                      <Button type="link" onClick={() => helpers.addText(arrays)}>
                        添加文本组件
                      </Button>
                      <Button type="link" onClick={() => helpers.addMedia(arrays)}>
                        添加媒体组件
                      </Button>
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
const ComponentForm = styled.div`
  flex: 1;
`;
const ComponentToolBar = styled.div`
  width: 230px;
  margin-left: 40px;
`;
