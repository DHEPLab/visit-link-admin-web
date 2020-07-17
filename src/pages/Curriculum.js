import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Arrays from 'lodash/array';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { Form, Space, Button, Input, InputNumber, Select } from 'antd';

import Rules from '../constants/rules';
import { CurriculumBabyStage } from '../constants/enums';
import { useBoolState } from '../utils';
import { filterLessons, validateLessonNumberUnique } from '../utils/curriculum';
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
  const { id } = useParams();
  const history = useHistory();
  const { pathname } = useLocation();

  const [readonly, setReadonly] = useState();
  const [title, setTitle] = useState('创建新课程');
  const [submitURL, setSubmitURL] = useState();

  const [form] = Form.useForm();
  const [curriculum, setCurriculum] = useState({});
  const [lessons, setLessons] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [draftId, setDraftId] = useState();
  const [draftDate, setDraftDate] = useState();

  useEffect(() => {
    setReadonly(
      !pathname.includes('/curriculums/edit') && !pathname.includes('/curriculums/create')
    );
  }, [pathname, setReadonly]);

  useEffect(() => {
    if (readonly == null || !id) return;
    Axios.get(`/admin/curriculums/${id}`).then(({ data, headers }) => {
      if (!readonly) form.setFieldsValue(data);
      setTitle(data.name);
      setDraftId(headers['x-draft-id']);
      setDraftDate(headers['x-draft-date']);
      setLessons(data.lessons);
      setSchedules(data.schedules);
      setCurriculum({ ...data, lessons: [], schedules: [] });
    });
  }, [id, form, readonly]);

  function submitDraft() {
    setSubmitURL('/admin/curriculums/draft');
    form.submit();
  }

  function submitPublish() {
    setSubmitURL('/admin/curriculums');
    form.submit();
  }

  function onFinish(values) {
    Axios.post(submitURL, {
      id,
      ...values,
      lessons,
      schedules,
    }).then(history.goBack);
  }

  function handleDelteDraft() {
    Axios.delete(`/admin/curriculums/${draftId}`).then(() => {
      setDraftId('');
    });
  }

  // fix page flash
  if (readonly == null || (id && curriculum.name == null)) return null;

  return (
    <>
      <DetailHeader
        icon="iconcurriculum-primary"
        menu="课程管理"
        title={title}
        extra={
          <Space size="large">
            {readonly ? (
              <>
                {!draftId && (
                  <Button type="danger" onClick={() => history.push(`/curriculums/edit/${id}`)}>
                    编辑模块
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button ghost type="danger" onClick={submitDraft}>
                  保存至草稿
                </Button>
                <Button type="danger" onClick={submitPublish}>
                  保存并发布
                </Button>
              </>
            )}
          </Space>
        }
      />

      {draftId && (
        <DraftBar
          title="本课程有1个尚未发布的草稿："
          lastModifiedDraftAt={draftDate}
          onRemove={handleDelteDraft}
          onClick={() => history.push(`/curriculums/edit/${draftId}`)}
        />
      )}

      <Card title="课程基本信息">
        {readonly ? (
          <ReadonlyForm value={curriculum} />
        ) : (
          <Form data-testid="basic-form" form={form} onFinish={onFinish}>
            <Form.Item label="课程名称" name="name" rules={Rules.Required}>
              <Input placeholder="请输入课程名称，限20个汉字" />
            </Form.Item>
            <Form.Item label="课程描述" name="description" rules={Rules.Required}>
              <Input placeholder="请输入课程描述，限50个汉字" />
            </Form.Item>
          </Form>
        )}
      </Card>

      <EnhancedLessons disabled={readonly} value={lessons} onChange={setLessons} />
      <EnhancedSchedules
        disabled={readonly}
        value={schedules}
        lessonOptions={lessons}
        onChange={setSchedules}
      />
    </>
  );
}

const EnhancedLessons = withEdit(Lessons);
const EnhancedSchedules = withEdit(Schedules);

function ReadonlyForm({ value: { name, description } }) {
  return (
    <div data-testid="readonly-form">
      <StaticField label="课程名称">{name}</StaticField>
      <StaticField label="课程描述">{description}</StaticField>
    </div>
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

    function openCreateModal(defaultValue = {}) {
      setCurrentEditIndex(-1);
      setCurrentEditValue(defaultValue);
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
  const { networks } = useSelector((state) => state);
  const [moduleOptions, setModuleOptions] = useState([]);

  function onFinish(formValues) {
    if (currentEditIndex === -1) {
      // create lesson generate temp id to identity unique lesson
      onChange(Arrays.concat(value, { ...formValues, id: Date.now() }));
    } else {
      onChange(replace(value, currentEditIndex, { ...formValues, id: currentEditValue.id }));
    }
    closeModal();
  }

  function handleDelete(index) {
    onChange(pullAt(value, index));
  }

  function loadModuleOptions() {
    Axios.get('/admin/modules', {
      params: {
        size: 1000,
        published: true,
      },
    }).then(({ data }) => {
      setModuleOptions(data.content.map((module) => ({ label: module.number, value: module.id })));
    });
  }

  return (
    <Card
      noPadding
      title="课堂列表"
      extra={
        !disabled && (
          <Button type="shade" onClick={() => openCreateModal({ stage: 'EDC' })}>
            添加新课堂
          </Button>
        )
      }
    >
      <ModalForm
        title="编辑课堂"
        visible={visible}
        initialValues={currentEditValue}
        onCancel={closeModal}
        onFinish={onFinish}
      >
        <Form.Item
          label="课堂序号"
          name="number"
          rules={[
            ...Rules.Required,
            () => ({
              validator(_, number) {
                if (!number || validateLessonNumberUnique(value, number, currentEditValue.id)) {
                  return Promise.resolve();
                }
                return Promise.reject('课堂序号不能重复');
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="课堂名称" name="name" rules={Rules.Required}>
          <Input />
        </Form.Item>
        <Form.Item label="课堂描述" name="description" rules={Rules.Required}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="适用宝宝" name="stage" rules={Rules.Required}>
          <RadioEnum name="CurriculumBabyStage" />
        </Form.Item>
        <ApplicableDaysContainer>
          <Form.Item
            label="适用天数"
            labelCol={{ span: 0 }}
            name="startOfApplicableDays"
            rules={Rules.Required}
          >
            <InputNumber min={1} precision={0} placeholder="天" />
          </Form.Item>
          <ApplicableDaysConnector>至</ApplicableDaysConnector>
          <Form.Item
            label="适用天数"
            labelCol={{ span: 0 }}
            name="endOfApplicableDays"
            rules={[
              ...Rules.Required,
              ({ getFieldValue }) => ({
                validator(_, endOfApplicableDays) {
                  if (
                    !endOfApplicableDays ||
                    Number(endOfApplicableDays) > Number(getFieldValue('startOfApplicableDays'))
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject('必须大于起始天数');
                },
              }),
            ]}
          >
            <InputNumber min={1} precision={0} placeholder="天" />
          </Form.Item>
        </ApplicableDaysContainer>
        <Form.Item label="包含模块" name="modules" rules={Rules.Required}>
          <Select
            mode="multiple"
            labelInValue
            options={moduleOptions}
            onFocus={loadModuleOptions}
            loading={networks['/admin/modules' > 0]}
          ></Select>
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
              return `${CurriculumBabyStage[record.stage]} ${record.startOfApplicableDays}天 - ${
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

const ApplicableDaysContainer = styled.div`
  display: flex;
  padding-left: ${92 + 23 + 14}px;
`;

const ApplicableDaysConnector = styled.div`
  margin: 0 14px;
  margin-top: 8px;
`;

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
          <Button type="shade" onClick={() => openCreateModal({ stage: 'EDC' })}>
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
        <Form.Item label="规则名称" name="name" rules={Rules.Required}>
          <Input />
        </Form.Item>
        <Form.Item label="适用宝宝" name="stage" rules={Rules.Required}>
          <RadioEnum name="CurriculumBabyStage" />
        </Form.Item>
        <ApplicableDaysContainer>
          <Form.Item
            label="适用月数"
            labelCol={{ span: 0 }}
            name="startOfApplicableMonths"
            rules={Rules.Required}
          >
            <InputNumber min={0} precision={0} placeholder="月" />
          </Form.Item>
          <ApplicableDaysConnector>至</ApplicableDaysConnector>
          <Form.Item
            label="适用月数"
            labelCol={{ span: 0 }}
            name="endOfApplicableMonths"
            rules={[
              ...Rules.Required,
              ({ getFieldValue }) => ({
                validator(_, endOfApplicableMonths) {
                  if (
                    !endOfApplicableMonths ||
                    Number(endOfApplicableMonths) >=
                      Number(getFieldValue('startOfApplicableMonths'))
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject('必须大于等于起始月');
                },
              }),
            ]}
          >
            <InputNumber min={1} precision={0} placeholder="月" />
          </Form.Item>
        </ApplicableDaysContainer>
        <Form.Item
          noStyle
          shouldUpdate={(pre, cur) =>
            pre.stage !== cur.stage ||
            pre.startOfApplicableMonths !== cur.startOfApplicableMonths ||
            pre.endOfApplicableMonths !== cur.endOfApplicableMonths
          }
        >
          {({ getFieldValue, setFieldsValue }) => {
            // filter lesson options
            // Only lesson at the same stage are available and schedule range must contain lesson range
            setFieldsValue({
              lessons: [],
            });
            const stage = getFieldValue('stage');
            const startMonths = getFieldValue('startOfApplicableMonths');
            const endMonths = getFieldValue('endOfApplicableMonths');
            return (
              <Form.Item label="包含课堂" name="lessons" rules={Rules.Required}>
                <Select
                  mode="multiple"
                  labelInValue
                  options={filterLessons(lessonOptions, stage, startMonths, endMonths).map(
                    (lesson) => ({
                      label: lesson.number,
                      value: lesson.number,
                    })
                  )}
                ></Select>
              </Form.Item>
            );
          }}
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
              return `${CurriculumBabyStage[record.stage]} ${
                record.startOfApplicableMonths
              }个月 - ${record.endOfApplicableMonths}个月`;
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
