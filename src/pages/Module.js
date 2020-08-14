import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Formik } from 'formik';
import { Form, Space, Button, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { debounce } from 'lodash';

import Factory from '../components/curriculum/factory';
import ModuleComponents from '../components/curriculum/ModuleComponents';
import { Rules } from '../constants/*';
import { ModuleTopic } from '../constants/enums';
import {
  DraftBar,
  Card,
  DetailHeader,
  SelectEnum,
  StaticField,
  DeleteConfirmModal,
} from '../components/*';
import { moduleFinishActionOptions } from '../actions';

export default function Module() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [readonly, setReadonly] = useState();
  const history = useHistory();
  const dispatch = useDispatch();

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

    Axios.get('/admin/modules', {
      params: {
        size: 1000,
        published: true,
      },
    }).then((response) => dispatch(moduleFinishActionOptions(response.data)));

    if (!readonly) {
      // A fixed value 687px that module component body offset top, can also use ref.current.offsetTop get this value
      return stickyScrollListener(687, setStickyTop);
    }
  }, [id, form, readonly, dispatch]);

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
                        <Button ghost type="danger">
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
            <ModuleComponents value={values.components} readonly={readonly} stickyTop={stickyTop} />
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
