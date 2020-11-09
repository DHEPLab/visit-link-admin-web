import React, { useState, useEffect } from "react";
import Axios from "axios";
import Arrays from "lodash/array";
import styled from "styled-components";
import moment from "moment";
import { useSelector } from "react-redux";
import { useHistory, useParams, useLocation, Prompt } from "react-router-dom";
import { Tooltip, Form, Space, Button, Input, InputNumber, Select, message } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";

import Rules from "../constants/rules";
import CurriculumUtils from "../utils/curriculum";
import { CurriculumBabyStage } from "../constants/enums";
import { useBoolState } from "../utils";
import {
  StaticField,
  RadioEnum,
  Card,
  DetailHeader,
  DraftBar,
  ZebraTable,
  ModalForm,
  DeleteConfirmModal,
} from "../components/*";

export default function Curriculum() {
  const { id } = useParams();
  const history = useHistory();
  const { pathname } = useLocation();

  const [isPrompt, setIsPrompt] = useState(true);
  const [readonly, setReadonly] = useState();
  const [title, setTitle] = useState("创建新大纲");
  const [submitURL, setSubmitURL] = useState();

  const [form] = Form.useForm();
  const [curriculum, setCurriculum] = useState({});
  const [lessons, setLessons] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [draftId, setDraftId] = useState();
  const [draftDate, setDraftDate] = useState();

  useEffect(() => {
    setReadonly(!pathname.includes("/curriculums/edit") && !pathname.includes("/curriculums/create"));
  }, [pathname, setReadonly]);

  useEffect(() => {
    if (readonly == null || !id) return;
    Axios.get(`/admin/curriculums/${id}`).then(({ data, headers }) => {
      if (!readonly) form.setFieldsValue(data);
      setTitle(data.name);
      setDraftId(headers["x-draft-id"]);
      setDraftDate(headers["x-draft-date"]);
      setLessons(data.lessons);
      setSchedules(data.schedules);
      setCurriculum({ ...data, lessons: [], schedules: [] });
    });
  }, [id, form, readonly]);

  function submitDraft() {
    setSubmitURL("/admin/curriculums/draft");
    form.submit();
    setIsPrompt(false);
  }

  function submitPublish() {
    setSubmitURL("/admin/curriculums");
    form.submit();
    setIsPrompt(false);
  }

  function validate() {
    if (lessons.length === 0) {
      message.warn("至少添加一个课堂");
      return false;
    }
    if (schedules.length === 0) {
      message.warn("至少添加一个匹配计划");
      return false;
    }
    for (const schedule of schedules) {
      if (!schedule.lessons || schedule.lessons.length === 0) {
        message.warn(`匹配计划 ${schedule.name} 至少选择一个课堂`);
        return false;
      }
    }
    return true;
  }

  function onFinish(values) {
    if (!validate()) return;
    Axios.post(submitURL, {
      id,
      ...values,
      lessons,
      schedules,
    }).then(history.goBack);
  }

  function handleDelteDraft() {
    Axios.delete(`/admin/curriculums/${draftId}`).then(() => {
      setDraftId("");
    });
  }

  function handleDeleteCurriculum() {
    Axios.delete(`/admin/curriculums/${id}`).then(() => {
      history.goBack();
    });
  }

  function onChangeLessons(_lessons) {
    setLessons(_lessons);
    setSchedules(CurriculumUtils.cleanInvalidLessons(schedules, _lessons));
  }

  // fix page flash
  if (readonly == null || (id && curriculum.name == null)) return null;

  return (
    <>
      <Prompt
        when={isPrompt}
        message={(location) => {
          let isstop = location.pathname.startsWith("/curriculums/edit/");
          if (isstop || readonly) {
            return true;
          } else {
            return "当前页面有未保存或未提交的内容，离开后将丢失已编辑内容，您确定要离开吗?";
          }
        }}
      />
      <DetailHeader
        icon="iconcurriculum-primary"
        menu="大纲管理"
        title={title}
        role={readonly && moment(curriculum.lastPublishedAt).format("YYYY/MM/DD HH:mm")}
        extra={
          <Space size="large">
            {readonly ? (
              <>
                <DeleteConfirmModal
                  title="删除大纲"
                  content="删除大纲后，会将大纲分配的所有宝宝的待开始家访清除，这些宝宝安排家访时将找不到匹配的课堂是否继续？"
                  onConfirm={handleDeleteCurriculum}
                >
                  <Button ghost type="danger">
                    删除大纲
                  </Button>
                </DeleteConfirmModal>

                {!draftId && (
                  <Button type="danger" onClick={() => history.push(`/curriculums/edit/${id}`)}>
                    编辑大纲
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
          title="本大纲有1个尚未发布的草稿："
          lastModifiedDraftAt={draftDate}
          onRemove={handleDelteDraft}
          onClick={() => history.push(`/curriculums/edit/${draftId}`)}
        />
      )}

      <Card title="大纲基本信息">
        {readonly ? (
          <ReadonlyForm value={curriculum} />
        ) : (
          <Form data-testid="basic-form" form={form} onFinish={onFinish}>
            <Form.Item label="大纲名称" name="name" rules={[...Rules.Required, { max: 20 }]}>
              <Input placeholder="请输入大纲名称，限20个汉字" />
            </Form.Item>
            <Form.Item label="大纲描述" name="description" rules={[...Rules.Required, { max: 50 }]}>
              <Input.TextArea rows={5} placeholder="请输入大纲描述，限50个汉字" />
            </Form.Item>
          </Form>
        )}
      </Card>

      <EnhancedLessons disabled={readonly} value={lessons} onChange={onChangeLessons} />
      <EnhancedSchedules disabled={readonly} value={schedules} lessonOptions={lessons} onChange={setSchedules} />
    </>
  );
}

const EnhancedLessons = withEdit(Lessons);
const EnhancedSchedules = withEdit(Schedules);

function ReadonlyForm({ value: { name, description } }) {
  return (
    <div data-testid="readonly-form">
      <StaticField label="大纲名称">{name}</StaticField>
      <StaticField label="大纲描述">{description}</StaticField>
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
      onChange(Arrays.concat(value, formValues));
    } else {
      onChange(replace(value, currentEditIndex, { ...formValues, id: currentEditValue.id }));
    }
    closeModal();
  }

  function handleDelete(index) {
    onChange(pullAt(value, index));
  }

  function loadModuleOptions() {
    Axios.get("/admin/modules", {
      params: {
        size: 1000,
        published: true,
      },
    }).then(({ data }) => {
      setModuleOptions(data.content.map(({ number, id }) => ({ label: number, value: id })));
    });
  }

  return (
    <Card
      noPadding
      title="课堂列表"
      tooltip={
        !disabled && (
          <>
            <p>请注意</p>
            <p>1.课堂适用时间不符合已添加匹配规则的时间范围会导致匹配规则内已添加的课堂丢失</p>
            <p>2.修改适用时间可能会导致一些拜访计划不可用，请及时通知社区工作者</p>
          </>
        )
      }
      extra={
        !disabled && (
          <Button type="shade" onClick={() => openCreateModal({ stage: "EDC" })}>
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
                if (
                  !number ||
                  CurriculumUtils.validateLessonNumber(
                    value,
                    number,
                    // exclude origin number
                    currentEditIndex === -1 ? null : value[currentEditIndex].number
                  )
                ) {
                  return Promise.resolve();
                }
                return Promise.reject("课堂序号不能重复");
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
        <ApplicableDays value={value} currentEditValue={currentEditValue} />
        <Form.Item label="包含模块" name="modules" rules={Rules.Required}>
          <Select
            mode="multiple"
            labelInValue
            options={moduleOptions}
            onFocus={loadModuleOptions}
            loading={!!networks["/admin/modules"]}
          ></Select>
        </Form.Item>
        <Form.Item label="调查问卷" name="questionnaireAddress" rules={[{ max: 100 }]}>
          <Input />
        </Form.Item>
        <Form.Item label="短信问卷" name="smsQuestionnaireAddress" rules={[{ max: 100 }]}>
          <Input />
        </Form.Item>
      </ModalForm>

      <ZebraTable
        rowKey="number"
        pagination={false}
        dataSource={value}
        columns={[
          {
            title: "序号",
            dataIndex: "number",
            width: 200,
          },
          {
            title: "适用宝宝成长时期区间",
            dataIndex: "stage",
            width: 400,
            render: (_, record) => {
              return `${CurriculumBabyStage[record.stage]} ${record.startOfApplicableDays}天 - ${
                record.endOfApplicableDays
              }天`;
            },
          },
          {
            title: "包含模块",
            dataIndex: "modules",
            render: renderDomain,
          },
          lessonOperation(disabled, handleDelete, openEditModal),
        ]}
      />
    </Card>
  );
}

function ApplicableDays({ value, currentEditValue }) {
  return (
    <ApplicableDaysContainer>
      <Form.Item noStyle shouldUpdate={(pre, cur) => pre.stage !== cur.stage}>
        {({ getFieldValue }) => {
          return (
            <>
              <Form.Item
                label="适用天数"
                labelCol={{ span: 0 }}
                name="startOfApplicableDays"
                rules={[...Rules.Required]}
              >
                <InputNumber
                  min={1}
                  max={9999}
                  precision={0}
                  formatter={(value) => `${value}天`}
                  parser={(value) => value.replace("天", "")}
                />
              </Form.Item>
              <ApplicableDaysConnector>至</ApplicableDaysConnector>
              <EndOfApplicableDaysFormItem
                label="适用天数"
                labelCol={{ span: 0 }}
                name="endOfApplicableDays"
                rules={[
                  ...Rules.Required,
                  ({ getFieldValue }) => ({
                    validator(_, endOfApplicableDays) {
                      if (
                        !endOfApplicableDays ||
                        Number(endOfApplicableDays) > Number(getFieldValue("startOfApplicableDays"))
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject("必须大于起始天数");
                    },
                  }),
                  ({ getFieldValue }) => ({
                    validator(_, endOfApplicableDays) {
                      const stage = getFieldValue("stage");
                      const startOfApplicableDays = Number(getFieldValue("startOfApplicableDays"));
                      endOfApplicableDays = Number(endOfApplicableDays);
                      if (
                        !endOfApplicableDays ||
                        CurriculumUtils.validateLessonDateRange(value, {
                          id: currentEditValue.id,
                          stage,
                          startOfApplicableDays,
                          endOfApplicableDays,
                        })
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject("适用天数不能重叠");
                    },
                  }),
                ]}
              >
                <InputNumber
                  min={1}
                  max={9999}
                  precision={0}
                  formatter={(value) => `${value}天`}
                  parser={(value) => value.replace("天", "")}
                />
              </EndOfApplicableDaysFormItem>
            </>
          );
        }}
      </Form.Item>
    </ApplicableDaysContainer>
  );
}

const EndOfApplicableDaysFormItem = styled(Form.Item)`
  .ant-form-item-explain,
  .ant-form-item-extra {
    margin-left: -80px;
  }
`;

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
      onChange(replace(value, currentEditIndex, { ...formValues, id: currentEditValue.id }));
    }
    closeModal();
  }

  function handleDelete(index) {
    onChange(pullAt(value, index));
  }

  return (
    <Card
      title="大纲区间匹配规则"
      extra={
        !disabled && (
          <Button type="shade" onClick={() => openCreateModal({ stage: "EDC" })}>
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
        <ApplicableDays value={value} currentEditValue={currentEditValue} />
        <Form.Item
          noStyle
          shouldUpdate={(pre, cur) =>
            pre.stage !== cur.stage ||
            pre.startOfApplicableDays !== cur.startOfApplicableDays ||
            pre.endOfApplicableDays !== cur.endOfApplicableDays
          }
        >
          {({ getFieldValue, setFieldsValue }) => {
            // filter lesson options
            // Only lesson at the same stage are available and schedule range must contain lesson range
            setFieldsValue({
              lessons: [],
            });
            const stage = getFieldValue("stage");
            const startMonths = getFieldValue("startOfApplicableDays");
            const endMonths = getFieldValue("endOfApplicableDays");
            return (
              <Form.Item label="包含课堂" name="lessons" rules={Rules.Required}>
                <Select
                  mode="multiple"
                  labelInValue
                  options={CurriculumUtils.filterLessons(lessonOptions, stage, startMonths, endMonths).map(
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
            title: "规则",
            dataIndex: "name",
            width: 200,
          },
          {
            title: "适用宝宝成长时期区间",
            dataIndex: "stage",
            width: 400,
            render: (_, record) => {
              return `${CurriculumBabyStage[record.stage]} ${record.startOfApplicableDays}天 - ${
                record.endOfApplicableDays
              }天`;
            },
          },
          {
            title: "包含课堂",
            dataIndex: "lessons",
            render: renderDomain,
          },
          scheduleOperation(disabled, handleDelete, openEditModal),
        ]}
      />
    </Card>
  );
}

const renderDomain = (h) => h.map((v) => v.label).join("、");

const lessonOperation = (disabled, handleDelete, openEditModal) => {
  if (disabled) return {};
  return {
    title: (
      <>
        操作 &nbsp;
        {!disabled && (
          <Tooltip title="删除课堂同时会导致之前已添加的匹配规则中的此课堂丢失" placement="left">
            <InfoCircleFilled style={{ color: "#000" }} />
          </Tooltip>
        )}
      </>
    ),
    width: 200,
    align: "center",
    render(_, record, index) {
      if (disabled) return null;
      return (
        <Space size="large">
          <DeleteConfirmModal onConfirm={() => handleDelete(index)}>
            <Button size="small" type="link">
              删除
            </Button>
          </DeleteConfirmModal>
          <Button size="small" type="link" onClick={() => openEditModal(record, index)}>
            编辑
          </Button>
        </Space>
      );
    },
  };
};

const scheduleOperation = (disabled, handleDelete, openEditModal) => {
  if (disabled) return {};
  return {
    title: <>操作</>,
    width: 200,
    align: "center",
    render(_, record, index) {
      if (disabled) return null;
      return (
        <Space size="large">
          <DeleteConfirmModal onConfirm={() => handleDelete(index)}>
            <Button size="small" type="link">
              删除
            </Button>
          </DeleteConfirmModal>
          <Button size="small" type="link" onClick={() => openEditModal(record, index)}>
            编辑
          </Button>
        </Space>
      );
    },
  };
};
