import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Space, Button, Input, InputNumber } from 'antd';

import Rules from '../constants/rules';
import { useBoolState } from '../utils';
import {
  StaticField,
  RadioEnum,
  Card,
  DetailHeader,
  DraftBar,
  ZebraTable,
  ModalForm,
} from '../components/*';

export default function Curriculum() {
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();

  const [requestURL, setRequestURL] = useState();
  const [submitURL, setSubmitURL] = useState();
  const [editable, setEditable] = useState();

  const [curriculum, setCurriculum] = useState({});
  const [lessons, setLessons] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const submitDraft = () => setSubmitURL('/admin/curriculum/draft');
  const submitPublish = () => setSubmitURL('/admin/curriculum');

  useEffect(() => {
    switch (location.pathname) {
      case '/curriculum':
        setEditable(false);
        setRequestURL('/admin/curriculum');
        break;
      case '/curriculum/draft':
        setEditable(true);
        setRequestURL('/admin/curriculum/draft');
        break;
      default:
        console.warn(`error location.pathname ${location.pathname}`);
    }
  }, [location]);

  useEffect(() => {
    if (!requestURL) return;
    Axios.get(requestURL).then(({ data }) => {
      if (!data) return;
      mapperCurriculum(data);
      setLessons(data.lessons);
      setSchedules(data.schedules);
    });
  }, [requestURL]);

  function mapperCurriculum({
    id,
    name,
    description,
    hasDraft,
    lastPublishedAt,
    lastModifiedDraftAt,
  }) {
    setCurriculum({ id, name, description, hasDraft, lastPublishedAt, lastModifiedDraftAt });
    form.setFieldsValue({ name, description });
  }

  function handleEdit() {
    history.push('/curriculum/draft');
  }

  function onFinish(values) {
    Axios.post(submitURL, {
      ...values,
      lessons,
      schedules,
    }).then(() => history.push('/curriculum'));
  }

  return (
    <>
      <DetailHeader
        icon="iconcurriculum-primary"
        menu="课程管理"
        extra={
          editable ? (
            <Space size="large">
              <Button
                ghost
                type="danger"
                onClick={() => {
                  submitDraft();
                  form.submit();
                }}
              >
                保存草稿
              </Button>
              <Button
                type="danger"
                onClick={() => {
                  submitPublish();
                  form.submit();
                }}
              >
                保存并发布
              </Button>
            </Space>
          ) : (
            <>
              {!curriculum.hasDraft && (
                <Button ghost type="primary" onClick={handleEdit}>
                  编辑
                </Button>
              )}
            </>
          )
        }
      />
      {(curriculum.id || editable) && (
        <>
          {curriculum.hasDraft && (
            <DraftBar
              lastModifiedDraftAt={curriculum.lastModifiedDraftAt}
              onClick={() => history.push('/curriculum/draft')}
            />
          )}

          <Card title="课程基本信息">
            {editable ? (
              <Form form={form} onFinish={onFinish}>
                <Form.Item label="课程名称" name="name" rules={Rules.Required}>
                  <Input />
                </Form.Item>
                <Form.Item label="课程描述" name="description" rules={Rules.Required}>
                  <Input />
                </Form.Item>
              </Form>
            ) : (
              <StaticForm value={curriculum} />
            )}
          </Card>

          <Lessons disabled={!editable} value={lessons} onChange={setLessons} />
          <Schedules disabled={!editable} value={schedules} onChange={setSchedules} />
        </>
      )}
    </>
  );
}

function StaticForm({ value: { name, description } }) {
  return (
    <>
      <StaticField label="课程名称">{name}</StaticField>
      <StaticField label="课程描述">{description}</StaticField>
    </>
  );
}

function Lessons({ disabled, value, onChange }) {
  const [visible, openModal, closeModal] = useBoolState();

  function onFinish(values) {
    onChange([...value, values]);
    closeModal();
  }

  return (
    <>
      <Card
        title="课堂列表"
        extra={
          !disabled && (
            <Button type="shade" onClick={openModal}>
              添加新课堂
            </Button>
          )
        }
        noPadding
      >
        <ZebraTable
          rowKey="number"
          pagination={false}
          dataSource={value}
          columns={[
            {
              title: '序号',
              dataIndex: 'number',
            },
            {
              title: '适用宝宝成长时期区间',
              dataIndex: 'stage',
            },
            {
              title: '包含模块',
            },
            {
              title: '操作',
            },
          ]}
        />
      </Card>

      <ModalForm title="编辑课堂" visible={visible} onCancel={closeModal} onFinish={onFinish}>
        <Form.Item label="课堂序号" name="number">
          <Input />
        </Form.Item>
        <Form.Item label="课堂名称" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="课堂描述" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="适用宝宝" name="stage">
          <RadioEnum name="BabyStage" />
        </Form.Item>
        <Form.Item label="开始" name="startOfApplicableDays">
          <InputNumber />
        </Form.Item>
        <Form.Item label="结束" name="endOfApplicableDays">
          <InputNumber />
        </Form.Item>
        <Form.Item label="调查问卷" name="questionnaireAddress">
          <Input />
        </Form.Item>
        <Form.Item label="短信问卷" name="smsQuestionnaireAddress">
          <Input />
        </Form.Item>
      </ModalForm>
    </>
  );
}

function Schedules({ disabled, value, onChange }) {
  const [visible, openModal, closeModal] = useBoolState();

  function onFinish(values) {
    onChange([...value, values]);
    closeModal();
  }

  return (
    <>
      <Card
        title="课程区间匹配规则"
        extra={
          !disabled && (
            <Button type="shade" onClick={openModal}>
              添加规则
            </Button>
          )
        }
        noPadding
      >
        <ZebraTable
          rowKey="name"
          pagination={false}
          dataSource={value}
          columns={[
            {
              title: '规则',
              dataIndex: 'name',
            },
            {
              title: '适用宝宝成长时期区间',
              dataIndex: 'stage',
            },
            {
              title: '包含课堂',
            },
            {
              title: '规则',
            },
          ]}
        />
      </Card>
      <ModalForm title="编辑规则" visible={visible} onCancel={closeModal} onFinish={onFinish}>
        <Form.Item label="规则名称" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="适用宝宝" name="stage">
          <RadioEnum name="BabyStage" />
        </Form.Item>
        <Form.Item label="开始" name="startOfApplicableMonths">
          <InputNumber />
        </Form.Item>
        <Form.Item label="结束" name="endOfApplicableMonths">
          <InputNumber />
        </Form.Item>
      </ModalForm>
    </>
  );
}
