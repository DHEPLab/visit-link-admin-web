import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Arrays from 'lodash/array';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Space, Button, Input, InputNumber, Select } from 'antd';

import Rules from '../constants/rules';
import { BabyStage } from '../constants/enums';
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
      form.setFieldsValue({ name: data.name, description: data.description });
      setCurriculum({ ...data, lessons: [], schedules: [] });
      setLessons(data.lessons);
      setSchedules(data.schedules);
    });
  }, [requestURL, form]);

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
          <Schedules
            disabled={!editable}
            value={schedules}
            lessonOptions={lessons}
            onChange={setSchedules}
          />
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
  const [moduleOptions, setModuleOptions] = useState([]);

  useEffect(() => {
    Axios.get('/admin/module', {
      params: {
        size: 1000,
      },
    }).then(({ data }) => {
      setModuleOptions(data.content.map((module) => ({ label: module.number, value: module.id })));
    });
  }, []);

  function onFinish(formValues) {
    onChange(Arrays.concat(value, formValues));
    closeModal();
  }

  return (
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
        <Form.Item label="包含模块" name="modules">
          <Select mode="multiple" labelInValue options={moduleOptions}></Select>
        </Form.Item>
        <Form.Item label="调查问卷" name="questionnaireAddress">
          <Input />
        </Form.Item>
        <Form.Item label="短信问卷" name="smsQuestionnaireAddress">
          <Input />
        </Form.Item>
      </ModalForm>
      <ZebraTable
        rowKey="number"
        pagination={false}
        dataSource={value}
        columns={[
          {
            title: '序号',
            dataIndex: 'number',
            width: 200,
          },
          {
            title: '适用宝宝成长时期区间',
            dataIndex: 'stage',
            width: 400,
            render: (_, record) => {
              return `${BabyStage[record.stage]} ${record.startOfApplicableDays}天 - ${
                record.endOfApplicableDays
              }天`;
            },
          },
          {
            title: '包含模块',
            dataIndex: 'modules',
            render: (h) => h.map((v) => v.label).join('、'),
          },
          {
            title: '操作',
            width: 200,
          },
        ]}
      />
    </Card>
  );
}

function Schedules({ disabled, value, onChange, lessonOptions }) {
  const [visible, openModal, closeModal] = useBoolState();

  function onFinish(formValues) {
    onChange(
      Arrays.concat(value, {
        ...formValues,
        // clean lesson.value, backend will be reconnect by label
        lessons: formValues.lessons.map((lesson) => ({ label: lesson.label })),
      })
    );
    closeModal();
  }

  return (
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
        <Form.Item label="包含课堂" name="lessons">
          <Select
            mode="multiple"
            labelInValue
            options={lessonOptions.map((lesson) => ({
              label: lesson.number,
              value: lesson.number,
            }))}
          ></Select>
        </Form.Item>
      </ModalForm>

      <ZebraTable
        rowKey="name"
        pagination={false}
        dataSource={value}
        columns={[
          {
            title: '规则',
            dataIndex: 'name',
            width: 200,
          },
          {
            title: '适用宝宝成长时期区间',
            dataIndex: 'stage',
            width: 400,
            render: (_, record) => {
              return `${BabyStage[record.stage]} ${record.startOfApplicableMonths}个月 - ${
                record.endOfApplicableMonths
              }个月`;
            },
          },
          {
            title: '包含课堂',
            dataIndex: 'lessons',
            render: (h) => h.map((v) => v.label).join('、'),
          },
          {
            title: '操作',
            width: 200,
          },
        ]}
      />
    </Card>
  );
}
