import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { Formik, FieldArray } from 'formik';
import { Form, Space, Button, Input } from 'antd';
import { useLocation, useHistory, useParams } from 'react-router-dom';

import Factory from '../components/curriculum/factory';
import { Rules } from '../constants/*';
import { ModuleTopic } from '../constants/enums';
import { ComponentField } from '../components/curriculum/*';
import { DraftBar, Iconfont, Card, DetailHeader, SelectEnum, StaticField } from '../components/*';

function ModuleComponents({ values, readonly }) {
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
                  name="components"
                  index={index}
                  readonly={readonly}
                  component={component}
                  key={component.key}
                  onRemove={() => helpers.remove(index)}
                  onMoveUp={() => handleMoveUp(index)}
                  onMoveDown={() => handleMoveDown(index)}
                />
              ))}
            </ComponentForm>

            {!readonly && (
              <ComponentToolBar>
                <Card title="添加组件：">
                  <Space direction="vertical" size="large">
                    <Button type="primary" onClick={() => helpers.push(Factory.createText())}>
                      <Iconfont type="icontext" /> 添加文本组件
                    </Button>
                    <Button type="primary" onClick={() => helpers.push(Factory.createMedia())}>
                      <Iconfont type="iconmedia" />
                      添加媒体组件
                    </Button>
                    <Button type="primary" onClick={() => helpers.push(Factory.createSwitch())}>
                      <Iconfont type="iconswitch" />
                      添加选择组件
                    </Button>
                    <Button
                      style={{ width: '182px' }}
                      type="primary"
                      onClick={() => helpers.push(Factory.createPageFooter())}
                    >
                      添加翻页分割组件
                    </Button>
                  </Space>
                </Card>
              </ComponentToolBar>
            )}
          </FieldArrayContainer>
        );
      }}
    </FieldArray>
  );
}

export default function Module() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [readonly, setReadonly] = useState();
  const history = useHistory();

  const [form] = Form.useForm();
  const [title, setTitle] = useState('创建新模块');
  const [submitURL, setSubmitURL] = useState();

  const [module, setModule] = useState({});
  const [components, setComponents] = useState();

  const [draftId, setDraftId] = useState();
  const [draftDate, setDraftDate] = useState();

  useEffect(() => {
    setReadonly(!pathname.includes('/modules/edit') && !pathname.includes('/modules/create'));
  }, [pathname, setReadonly]);

  useEffect(() => {
    if (readonly == null) return;
    if (!id) {
      setComponents([Factory.createText()]);
    } else {
      Axios.get(`/admin/module/${id}`).then(({ data, headers }) => {
        if (!readonly) form.setFieldsValue(data);
        setModule(data);
        setTitle(data.name);
        setComponents(data.components);
        setDraftId(headers['x-draft-id']);
        setDraftDate(headers['x-draft-date']);
      });
    }
  }, [id, form, readonly]);

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

  function handleDelteDraft() {
    Axios.delete(`/admin/module/${draftId}`).then(() => {
      setDraftId('');
    });
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
                {/* <Button ghost type="primary">
                  删除模块
                </Button> */}
                {readonly ? (
                  <>
                    {!draftId && (
                      <Button type="danger" onClick={() => history.push(`/modules/edit/${id}`)}>
                        编辑模块
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button ghost type="danger" onClick={() => submitDraft(handleSubmit)}>
                      保存至草稿
                    </Button>
                    <Button type="danger" onClick={() => submitPublish(handleSubmit)}>
                      保存并发布
                    </Button>
                  </>
                )}
              </Space>
            }
          ></DetailHeader>

          {draftId && (
            <DraftBar
              title="本模块有1个尚未发布的草稿："
              lastModifiedDraftAt={draftDate}
              onRemove={handleDelteDraft}
              onClick={() => history.push(`/modules/edit/${draftId}`)}
            />
          )}

          <Card title="模块基本信息">
            {readonly ? (
              <ReadonlyForm value={module} />
            ) : (
              <Form data-testid="basic-form" form={form} onFinish={onSubmit}>
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
            )}
          </Card>

          <Card title="模块内容">
            <ModuleComponents values={values} readonly={readonly} />
          </Card>
        </>
      )}
    </Formik>
  );
}

function ReadonlyForm({ value }) {
  return (
    <div data-testid="readonly-form">
      <StaticField label="模块名称">{value.name}</StaticField>
      <StaticField label="模块编号">{value.number}</StaticField>
      <StaticField label="模块描述">{value.description}</StaticField>
      <StaticField label="模块主题">{ModuleTopic[value.topic]}</StaticField>
    </div>
  );
}

const FieldArrayContainer = styled.div`
  display: flex;
`;
const ComponentForm = styled.div`
  flex: 1;
`;

const ComponentToolBar = styled.div`
  height: 360px;
  margin-left: 40px;
  box-shadow: 0px 4px 12px 0px rgba(255, 148, 114, 0.3);
  border-radius: 8px;
`;
