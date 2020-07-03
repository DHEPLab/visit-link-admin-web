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

  function submitDraft() {
    setSubmitURL('/admin/curriculum/draft');
    form.submit();
  }

  function submitPublish() {
    setSubmitURL('/admin/curriculum');
    form.submit();
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
              <Button ghost type="danger" onClick={submitDraft}>
                保存草稿
              </Button>
              <Button type="danger" onClick={submitPublish}>
                保存并发布
              </Button>
            </Space>
          ) : (
            <>
              {!curriculum.hasDraft && (
                <Button ghost type="primary" onClick={() => history.push('/curriculum/draft')}>
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

          <EnhancedLessons disabled={!editable} value={lessons} onChange={setLessons} />
          <EnhancedSchedules
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

const EnhancedLessons = withEdit(Lessons);
const EnhancedSchedules = withEdit(Schedules);

function StaticForm({ value: { name, description } }) {
  return (
    <>
      <StaticField label="课程名称">{name}</StaticField>
      <StaticField label="课程描述">{description}</StaticField>
    </>
  );
}

function withEdit(Wrapper) {
  return function (props) {
    const [visible, openModal, closeModal] = useBoolState();
    const [currentEditIndex, setCurrentEditIndex] = useState(-1);
    const [currentEditValue, setCurrentEditValue] = useState({});

    function pullAt(array, index) {
      const clone = [...array];
      Arrays.pullAt(clone, [index]);
      return clone;
    }

    function replace(array, index, object) {
      const clone = [...array];
      clone[index] = object;
      return clone;
    }

    function openEditModal(values, index) {
      setCurrentEditIndex(index);
      setCurrentEditValue(values);
      openModal();
    }

    function openCreateModal() {
      setCurrentEditIndex(-1);
      setCurrentEditValue({});
      openModal();
    }

    return (
      <Wrapper
        {...props}
        {...{
          visible,
          pullAt,
          replace,
          currentEditIndex,
          currentEditValue,
          openEditModal,
          openCreateModal,
          closeModal,
        }}
      />
    );
  };
}

function Lessons({
  disabled,
  value,
  onChange,
  pullAt,
  replace,
  currentEditIndex,
  currentEditValue,
  openEditModal,
  openCreateModal,
  closeModal,
  visible,
}) {
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
    if (currentEditIndex === -1) {
      onChange(Arrays.concat(value, formValues));
    } else {
      onChange(replace(value, currentEditIndex, formValues));
    }
    closeModal();
  }

  function handleDelete(index) {
    onChange(pullAt(value, index));
  }

  return (
    <Card
      title="课堂列表"
      extra={
        !disabled && (
          <Button type="shade" onClick={openCreateModal}>
            添加新课堂
          </Button>
        )
      }
      noPadding
    >
      <ModalForm
        title="编辑课堂"
        visible={visible}
        initialValues={currentEditValue}
        onCancel={closeModal}
        onFinish={onFinish}
      >
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
            render: renderDomain,
          },
          operation(disabled, handleDelete, openEditModal),
        ]}
      />
    </Card>
  );
}

function Schedules({
  disabled,
  value,
  onChange,
  lessonOptions,
  pullAt,
  replace,
  currentEditIndex,
  currentEditValue,
  openEditModal,
  openCreateModal,
  closeModal,
  visible,
}) {
  function onFinish(formValues) {
    if (currentEditIndex === -1) {
      onChange(
        Arrays.concat(value, {
          ...formValues,
          // clean lesson.value, backend will be reconnect by label
          lessons: formValues.lessons.map((lesson) => ({ label: lesson.label })),
        })
      );
    } else {
      onChange(replace(value, currentEditIndex, formValues));
    }
    closeModal();
  }

  function handleDelete(index) {
    onChange(pullAt(value, index));
  }

  return (
    <Card
      title="课程区间匹配规则"
      extra={
        !disabled && (
          <Button type="shade" onClick={openCreateModal}>
            添加规则
          </Button>
        )
      }
      noPadding
    >
      <ModalForm
        title="编辑规则"
        initialValues={currentEditValue}
        visible={visible}
        onCancel={closeModal}
        onFinish={onFinish}
      >
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
            render: renderDomain,
          },
          operation(disabled, handleDelete, openEditModal),
        ]}
      />
    </Card>
  );
}

const renderDomain = (h) => h.map((v) => v.label).join('、');

const operation = (disabled, handleDelete, openEditModal) => {
  return {
    title: '操作',
    width: 200,
    align: 'center',
    render(_, record, index) {
      if (disabled) return null;
      return (
        <Space size="large">
          <Button size="small" type="link" onClick={() => handleDelete(index)}>
            删除
          </Button>
          <Button size="small" type="link" onClick={() => openEditModal(record, index)}>
            编辑
          </Button>
        </Space>
      );
    },
  };
};
