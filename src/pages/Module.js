import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { Formik, FieldArray } from 'formik';
import { Form, Space, Button, Input } from 'antd';

import Rules from '../constants/rules';
import Factory from '../components/curriculum/factory';
import { Card, DetailHeader, SelectEnum } from '../components/*';
import { ComponentField } from '../components/curriculum/*';

function ModuleComponents({ values }) {
  return (
    <FieldArray name="components">
      {(helpers) => {
        function handleMoveUp(index) {
          if (index === 0) return;
          helpers.move(index, index - 1);
        }

        function handleMoveDown(index) {
          if (index === values.components.length - 1) return;
          helpers.move(index, index + 1);
        }

        return (
          <FieldArrayContainer>
            <ComponentForm>
              {values.components.map((component, index) => (
                <ComponentField
                  index={index}
                  name="components"
                  key={component.key}
                  component={component}
                  onRemove={() => helpers.remove(index)}
                  onMoveUp={() => handleMoveUp(index)}
                  onMoveDown={() => handleMoveDown(index)}
                />
              ))}
            </ComponentForm>
            <ComponentToolBar>
              <Card title="添加组件：">
                <Space direction="vertical" size="large">
                  <Button type="primary" onClick={() => helpers.push(Factory.createText())}>
                    添加文本组件
                  </Button>
                  <Button type="primary" onClick={() => helpers.push(Factory.createMedia())}>
                    添加媒体组件
                  </Button>
                  <Button type="primary" onClick={() => helpers.push(Factory.createSwitch())}>
                    添加选择组件
                  </Button>
                </Space>
              </Card>
            </ComponentToolBar>
          </FieldArrayContainer>
        );
      }}
    </FieldArray>
  );
}

/**
 * Curriculum Module Detail Page
 *
 * when route path is /modules/:id, can't edit
 * when route path is /modules/edit/:id, editable
 * when route path is /modules/edit/-1, create new module
 */
export default function Module() {
  const location = useLocation();
  const [editable, setEditable] = useState(false);
  const { id } = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const [title, setTitle] = useState('创建新模块');
  const [submitURL, setSubmitURL] = useState();
  const [components, setComponents] = useState([]);

  useEffect(() => {
    setEditable(location.pathname.includes('/modules/edit'));
  }, [location]);

  useEffect(() => {
    if (id === -1) {
      setComponents([]);
    }
  }, [id]);

  // useEffect(() => {
  //   if (!id) {
  //     setComponents([Factory.createSwitch()]);
  //   } else {
  //     Axios.get(`/admin/module/${id}`).then(({ data }) => {
  //       setTitle(data.name);
  //       form.setFieldsValue(data);
  //       setComponents(data.components);
  //     });
  //   }
  // }, [id, form]);

  function onSubmitFormik(values) {
    setComponents(values.components);
    form.submit();
  }

  function submitDraft(submit) {
    setSubmitURL('/admin/module/draft');
    submit();
  }

  function submitPublish(submit) {
    setSubmitURL('/admin/module');
    submit();
  }

  function onSubmit(values) {
    Axios.post(submitURL, {
      id,
      components,
      ...values,
    }).then(history.goBack);
  }

  if (!components) {
    return null;
  }

  return (
    <Formik initialValues={{ components }} onSubmit={onSubmitFormik}>
      {({ values, handleSubmit }) => (
        <>
          <DetailHeader
            icon="iconmodule-primary"
            menu="模块管理"
            title={title}
            extra={
              <Space size="large">
                {id && (
                  <Button ghost type="danger" onClick={() => submitDraft(handleSubmit)}>
                    保存至草稿
                  </Button>
                )}
                <Button type="danger" onClick={() => submitPublish(handleSubmit)}>
                  保存并发布
                </Button>
              </Space>
            }
          ></DetailHeader>

          <Card title="模块基本信息">
            <Form form={form} onFinish={onSubmit}>
              <Form.Item label="模块名称" name="name" rules={Rules.Required}>
                <Input placeholder="请输入模块名称，限20个汉字" />
              </Form.Item>
              <Form.Item label="模块编号" name="number" rules={Rules.Required}>
                <Input placeholder="请输入模块名称，限20个汉字" />
              </Form.Item>
              <Form.Item label="模块描述" name="description" rules={Rules.Required}>
                <Input.TextArea rows={4} placeholder="请输入模块描述，限50个汉字" />
              </Form.Item>
              <Form.Item label="模块主题" name="topic" rules={Rules.Required}>
                <SelectEnum name="ModuleTopic" placeholder="请选择模块主题" />
              </Form.Item>
            </Form>
          </Card>

          <Card title="模块内容">
            <ModuleComponents values={values} />
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
  height: 360px;
  margin-left: 40px;
  box-shadow: 0px 4px 12px 0px rgba(255, 148, 114, 0.3);
  border-radius: 8px;
`;
