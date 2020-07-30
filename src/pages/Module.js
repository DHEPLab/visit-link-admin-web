import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { Formik, FieldArray } from 'formik';
import { Form, Space, Button, Input, message } from 'antd';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { debounce } from 'lodash';

import Factory from '../components/curriculum/factory';
import { Rules } from '../constants/*';
import { ModuleTopic } from '../constants/enums';
import { ComponentField } from '../components/curriculum/*';
import {
  DraftBar,
  Iconfont,
  Card,
  DetailHeader,
  SelectEnum,
  StaticField,
  DeleteConfirmModal,
} from '../components/*';

function ModuleComponents({ values, readonly, stickyTop }) {
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
                <StickyContainer top={stickyTop}>
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
                </StickyContainer>
              </ComponentToolBar>
            )}
          </FieldArrayContainer>
        );
      }}
    </FieldArray>
  );
}

function stickyScrollListener(offsetTop, onChangeStickyTop) {
  // console.log('add listener');
  const onScroll = debounce((event) => {
    const diffTop = event.target.scrollTop - offsetTop;
    // console.log('set sticky top, top', diffTop);
    onChangeStickyTop(diffTop > 0 ? diffTop : 0);
  }, 100);
  document.getElementById('route-view').addEventListener('scroll', onScroll);
  return () => {
    // console.log('remove listener');
    document.getElementById('route-view').removeEventListener('scroll', onScroll);
  };
}

const FieldArrayContainer = styled.div`
  display: flex;
`;

const ComponentForm = styled.div`
  flex: 1;
`;

const ComponentToolBar = styled.div``;

const StickyContainer = styled.div`
  position: relative;
  top: ${({ top }) => top}px;
  height: 360px;
  margin-left: 40px;
  box-shadow: 0px 4px 12px 0px rgba(255, 148, 114, 0.3);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
`;

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
  const [stickyTop, setStickyTop] = useState(0);

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
      Axios.get(`/admin/modules/${id}`).then(({ data, headers }) => {
        if (!readonly) form.setFieldsValue(data);
        setModule(data);
        setTitle(data.name);
        setComponents(data.components);
        setDraftId(headers['x-draft-id']);
        setDraftDate(headers['x-draft-date']);
      });
    }
    if (!readonly) {
      // A fixed value 687px that module component body offset top, can also use ref.current.offsetTop get this value
      return stickyScrollListener(687, setStickyTop);
    }
  }, [id, form, readonly]);

  function onSubmitFormik(values) {
    setComponents(values.components);
    form.submit();
  }

  function submitDraft(submit) {
    setSubmitURL('/admin/modules/draft');
    submit();
  }

  function submitPublish(submit) {
    setSubmitURL('/admin/modules');
    submit();
  }

  function onSubmit(values) {
    if (components.length === 0) return message.warn('至少添加一个组件');

    Axios.post(submitURL, {
      id,
      components,
      ...values,
    }).then(history.goBack);
  }

  function handleDelteDraft() {
    Axios.delete(`/admin/modules/${draftId}`).then(() => {
      setDraftId('');
    });
  }

  function handleDeleteModule() {
    Axios.delete(`/admin/modules/${id}`).then(() => {
      history.goBack();
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
                {readonly ? (
                  <>
                    {id && (
                      <DeleteConfirmModal
                        title="删除模块"
                        content="删除后模块内容将无法恢复是否继续？"
                        onConfirm={handleDeleteModule}
                      >
                        <Button ghost type="primary">
                          删除模块
                        </Button>
                      </DeleteConfirmModal>
                    )}
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
                <Form.Item label="模块名称" name="name" rules={[...Rules.Required, { max: 40 }]}>
                  <Input placeholder="请输入模块名称，限40个字符" />
                </Form.Item>
                <Form.Item label="模块编号" name="number" rules={[...Rules.Required, { max: 20 }]}>
                  <Input placeholder="请输入模块编号，限20个字符" />
                </Form.Item>
                <Form.Item
                  label="模块描述"
                  name="description"
                  rules={[...Rules.Required, { max: 200 }]}
                >
                  <Input.TextArea rows={4} placeholder="请输入模块描述，限200个字符" />
                </Form.Item>
                <Form.Item label="模块主题" name="topic" rules={Rules.Required}>
                  <SelectEnum name="ModuleTopic" placeholder="请选择模块主题" />
                </Form.Item>
              </Form>
            )}
          </Card>

          <Card title="模块内容">
            <ModuleComponents values={values} readonly={readonly} stickyTop={stickyTop} />
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
