import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { Formik, FieldArray } from 'formik';
import { Form, Space, Button, Input } from 'antd';

import Rules from '../constants/rules';
import helpers from '../components/curriculum/helpers';
import { Card, DetailHeader, SelectEnum } from '../components/*';
import { ComponentField } from '../components/curriculum/*';

export default function Component() {
  const { id } = useParams();
  const history = useHistory();
  const [basicForm] = Form.useForm();
  const [saveAsStatus, setSaveAsStatus] = useState();
  const [components, setComponents] = useState();

  const saveAsDraftStatus = () => setSaveAsStatus('DRAFT');
  const saveAsPublishedStatus = () => setSaveAsStatus('PUBLISHED');

  useEffect(() => {
    if (!id) {
      setComponents([]);
    } else {
      Axios.get(`/admin/module/${id}`).then(({ data }) => {
        basicForm.setFieldsValue(data);
        setComponents(data.components);
      });
    }
  }, [id, basicForm]);

  function onSubmitFormik(values) {
    setComponents(values.components);
    basicForm.submit();
  }

  async function handleSave(values) {
    const method = id ? 'put' : 'post';
    await Axios[method](`/admin/module${id ? `/${id}` : ''}`, {
      components,
      ...values,
      status: saveAsStatus,
    });
    history.goBack();
  }

  if (!components) {
    return null;
  }

  return (
    <Formik initialValues={{ components }} onSubmit={onSubmitFormik}>
      {({ values, handleSubmit }) => (
        <>
          <DetailHeader
            menu="模块管理"
            title="创建新模块"
            extra={
              <Space size="large">
                <Button
                  ghost
                  type="danger"
                  onClick={() => {
                    saveAsDraftStatus();
                    handleSubmit();
                  }}
                >
                  保存至草稿
                </Button>
                <Button
                  type="danger"
                  onClick={() => {
                    saveAsPublishedStatus();
                    handleSubmit();
                  }}
                >
                  保存并发布
                </Button>
              </Space>
            }
          ></DetailHeader>

          <Card title="模块基本信息">
            <Form form={basicForm} onFinish={handleSave}>
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

          <Card title="模块内容">
            <FieldArray name="components">
              {(arrays) => (
                <FieldArrayContainer>
                  <ComponentForm>
                    {values.components.map((component, index) => (
                      <ComponentField
                        key={component.key}
                        name="components"
                        index={index}
                        onRemove={() => arrays.remove(index)}
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
            {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
          </Card>
        </>
      )}
    </Formik>
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
