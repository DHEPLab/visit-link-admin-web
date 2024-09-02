import React, { useState, useEffect } from "react";
import Axios from "axios";
import Arrays from "lodash/array";
import styled from "styled-components";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
} from "../components";
import { useTranslation } from "react-i18next";
import usePrompt from "@/hooks/usePrompt";

export default function Curriculum() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { t } = useTranslation("curriculum");

  const [isPrompt, setIsPrompt] = useState(true);
  const [readonly, setReadonly] = useState();
  const [title, setTitle] = useState(t("createNewCurriculum"));
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
      setLessons(data.lessons.map((n) => ({ ...n, questionnaire: n.questionnaire?.id })));
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
      message.warn(t("atLeastOneSession"));
      return false;
    }
    if (schedules.length === 0) {
      message.warn(t("atLeastOneMatchingPlan"));
      return false;
    }
    for (const schedule of schedules) {
      if (!schedule.lessons || schedule.lessons.length === 0) {
        message.warn(t("matchingPlanAtLeastOneSession", { name: schedule.name }));
        return false;
      }
    }
    return true;
  }

  function onFinish(values) {
    if (!validate()) return;
    const lessonResult = lessons.map((n) => ({
      ...n,
      questionnaire: n.questionnaire ? { id: n.questionnaire } : null,
    }));
    Axios.post(submitURL, {
      id,
      ...values,
      lessons: lessonResult,
      schedules,
    }).then(() => navigate(-1));
  }

  function handleDelteDraft() {
    Axios.delete(`/admin/curriculums/${draftId}`).then(() => {
      setDraftId("");
    });
  }

  function handleDeleteCurriculum() {
    Axios.delete(`/admin/curriculums/${id}`).then(() => {
      navigate(-1);
    });
  }

  function onChangeLessons(_lessons) {
    setLessons(_lessons);
    setSchedules(CurriculumUtils.cleanInvalidLessons(schedules, _lessons));
  }

  usePrompt({
    message: t("unsavedChangesWarning"),
    when: ({ currentLocation, nextLocation }) => {
      const gotoEditPage = nextLocation.pathname.startsWith("/curriculums/edit/");
      return isPrompt && currentLocation.pathname !== nextLocation.pathname && !(gotoEditPage || readonly);
    },
  });

  // fix page flash
  if (readonly == null || (id && curriculum.name == null)) return null;

  return (
    <>
      <DetailHeader
        icon="iconcurriculum-primary"
        menu={t("curriculumManagement")}
        title={title}
        role={readonly && dayjs(curriculum.lastPublishedAt).format("YYYY/MM/DD HH:mm")}
        extra={
          <Space size="large">
            {readonly ? (
              <>
                <DeleteConfirmModal
                  title={t("deleteCurriculum")}
                  content={t("deleteCurriculumWarning")}
                  onConfirm={handleDeleteCurriculum}
                >
                  <Button ghost danger>
                    {t("deleteCurriculum")}
                  </Button>
                </DeleteConfirmModal>

                {!draftId && (
                  <Button danger type="primary" onClick={() => navigate(`/curriculums/edit/${id}`)}>
                    {t("editCurriculum")}
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button ghost danger onClick={submitDraft}>
                  {t("saveToDraft")}
                </Button>
                <Button danger type="primary" onClick={submitPublish}>
                  {t("publish")}
                </Button>
              </>
            )}
          </Space>
        }
      />

      {draftId && (
        <DraftBar
          title={t("unpublishedDraft")}
          lastModifiedDraftAt={draftDate}
          onRemove={handleDelteDraft}
          onClick={() => navigate(`/curriculums/edit/${draftId}`)}
        />
      )}

      <Card title={t("curriculumInformation")}>
        {readonly ? (
          <ReadonlyForm value={curriculum} />
        ) : (
          <Form
            data-testid="basic-form"
            form={form}
            labelCol={{ span: 5 }}
            onFinish={onFinish}
            validateMessages={t("validateMessages", { ns: "common", returnObjects: true })}
          >
            <Form.Item
              label={t("curriculumName")}
              name="name"
              rules={[...Rules.Required, { max: 100, message: t("curriculum:curriculumNameTooLong") }]}
            >
              <Input placeholder={t("enterCurriculumNameWithLimit")} style={{ width: "600px" }} />
            </Form.Item>
            <Form.Item
              label={t("curriculumDescription")}
              name="description"
              rules={[...Rules.Required, { max: 1000, message: t("curriculumDescriptionTooLong") }]}
            >
              <Input.TextArea rows={5} placeholder={t("enterCurriculumDescriptionWithLimit")} style={{ width: 600 }} />
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
  const { t } = useTranslation("curriculum");
  return (
    <div data-testid="readonly-form">
      <StaticField label={t("curriculumName")} labelStyle={{ width: 180 }}>
        {name}
      </StaticField>
      <StaticField label={t("curriculumDescription")} labelStyle={{ width: 180 }}>
        {description}
      </StaticField>
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
  const { t } = useTranslation("curriculum");

  const [moduleOptions, setModuleOptions] = useState([]);
  const [questionnairesOptions, setQuestionnairesOptions] = useState([]);

  useEffect(() => {
    loadQuestionnairesOptions();
  }, [openEditModal, setQuestionnairesOptions]);

  function onFinish(formValues) {
    if (currentEditIndex === -1) {
      onChange(Arrays.concat(value, formValues));
    } else {
      onChange(replace(value, currentEditIndex, { ...formValues, id: currentEditValue?.id }));
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

  function loadQuestionnairesOptions() {
    Axios.get("/admin/questionnaires", {
      params: {
        size: 1000,
        published: true,
      },
    }).then(({ data }) => {
      setQuestionnairesOptions(data?.content?.map(({ name, id }) => ({ label: name, value: id })));
    });
  }

  return (
    <Card
      noPadding
      title={t("sessions")}
      tooltip={
        !disabled && (
          <>
            <p>{t("pleaseNote")}</p>
            <p>{t("sessionApplicabilityWarning")}</p>
            <p>{t("modifyApplicabilityWarning")}</p>
          </>
        )
      }
      extra={
        !disabled && (
          <Button type="shade" onClick={() => openCreateModal({ stage: "EDC" })}>
            {t("addNewSession")}
          </Button>
        )
      }
    >
      <ModalForm
        width={800}
        labelCol={{ span: 7 }}
        title={t("editSession")}
        visible={visible}
        initialValues={currentEditValue}
        onCancel={closeModal}
        onFinish={onFinish}
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true })}
      >
        <Form.Item
          label={t("sessionNumber")}
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
                    currentEditIndex === -1 ? null : value[currentEditIndex].number,
                  )
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(t("sessionNumberDuplicate"));
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={t("sessionName")} name="name" rules={Rules.Required}>
          <Input />
        </Form.Item>
        <Form.Item label={t("sessionDescription")} name="description" rules={Rules.Required}>
          <Input.TextArea style={{ width: 400 }} />
        </Form.Item>
        <Form.Item label={t("applicableBaby")} name="stage" rules={Rules.Required}>
          <RadioEnum name="CurriculumBabyStage" />
        </Form.Item>
        <ApplicableDays value={value} currentEditValue={currentEditValue} />
        <Form.Item label={t("modulesIncluded")} name="modules" rules={Rules.Required}>
          <Select
            mode="multiple"
            labelInValue
            options={moduleOptions}
            onFocus={loadModuleOptions}
            loading={!!networks["/admin/modules"]}
          />
        </Form.Item>
        <Form.Item label={t("survey")} name="questionnaire">
          <Select
            suffixIcon={null}
            options={questionnairesOptions}
            onFocus={loadQuestionnairesOptions}
            loading={!!networks["/admin/findAllQuestionnaires"]}
          />
        </Form.Item>
        <Form.Item label={t("textSurvey")} name="smsQuestionnaireAddress" rules={[{ max: 100 }]}>
          <Input />
        </Form.Item>
      </ModalForm>

      <ZebraTable
        rowKey="number"
        pagination={false}
        dataSource={value}
        columns={[
          {
            title: t("sessionNumber"),
            dataIndex: "number",
            width: 200,
          },
          {
            title: t("applicableBabyGrowthPeriod"),
            dataIndex: "stage",
            width: 400,
            render: (_, record) => {
              return `${t(CurriculumBabyStage[record.stage])} ${record.startOfApplicableDays}${t(
                "common:unit:day",
              )} - ${record.endOfApplicableDays}${t("common:unit:day")}`;
            },
          },
          {
            title: t("modulesIncluded"),
            dataIndex: "modules",
            render: renderDomain,
          },
          lessonOperation(disabled, handleDelete, openEditModal, t),
        ]}
      />
    </Card>
  );
}

function ApplicableDays({ value, currentEditValue }) {
  const { t } = useTranslation("curriculum");

  const startDateRequiredRule = {
    required: true,
    message: t("startDateRequired"),
  };

  const endDateRequiredRule = {
    required: true,
    message: t("endDateRequired"),
  };

  return (
    <ApplicableDaysContainer>
      <Form.Item noStyle labelCol={{ offset: 7 }} shouldUpdate={(pre, cur) => pre.stage !== cur.stage}>
        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
        {({ getFieldValue }) => {
          return (
            <>
              <Form.Item
                label={t("applicableDays")}
                labelCol={{ span: 0 }}
                name="startOfApplicableDays"
                rules={[
                  startDateRequiredRule,
                  ({ getFieldValue }) => ({
                    validator(_, startOfApplicableDays) {
                      const stage = getFieldValue("stage");
                      const endOfApplicableDays = Number(getFieldValue("endOfApplicableDays"));
                      startOfApplicableDays = Number(startOfApplicableDays);
                      if (
                        !startOfApplicableDays ||
                        CurriculumUtils.validateLessonDateRange(value, {
                          id: currentEditValue.id,
                          stage,
                          endOfApplicableDays,
                          startOfApplicableDays,
                        })
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(t("applicableDaysOverlap"));
                    },
                  }),
                ]}
              >
                <InputNumber
                  min={1}
                  max={9999}
                  precision={0}
                  formatter={(value) => `${value}${t("common:unit.day")}`}
                  parser={(value) => value.replace(t("common:unit.day"), "")}
                />
              </Form.Item>
              <ApplicableDaysConnector>{t("to")}</ApplicableDaysConnector>
              <EndOfApplicableDaysFormItem
                label={t("applicableDays")}
                labelCol={{ span: 0 }}
                name="endOfApplicableDays"
                rules={[
                  endDateRequiredRule,
                  ({ getFieldValue }) => ({
                    validator(_, endOfApplicableDays) {
                      if (
                        !endOfApplicableDays ||
                        Number(endOfApplicableDays) > Number(getFieldValue("startOfApplicableDays"))
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(t("endDayGreaterThanStart"));
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
                      return Promise.reject(t("applicableDaysOverlap"));
                    },
                  }),
                ]}
              >
                <InputNumber
                  min={1}
                  max={9999}
                  precision={0}
                  formatter={(value) => `${value}${t("common:unit.day")}`}
                  parser={(value) => value.replace(t("common:unit.day"), "")}
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
  padding-left: 29%;
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
  const { t } = useTranslation("curriculum");

  function onFinish(formValues) {
    if (currentEditIndex === -1) {
      onChange(
        Arrays.concat(value, {
          ...formValues,
          lessons: formValues.lessons.map((lesson) => ({ label: lesson.label })),
        }),
      );
    } else {
      onChange(replace(value, currentEditIndex, { ...formValues, id: currentEditValue?.id }));
    }
    closeModal();
  }

  function handleDelete(index) {
    onChange(pullAt(value, index));
  }

  return (
    <Card
      title={t("curriculumRangeMatchingRule")}
      extra={
        !disabled && (
          <Button type="shade" onClick={() => openCreateModal({ stage: "EDC" })}>
            {t("addRule")}
          </Button>
        )
      }
      noPadding
    >
      <ModalForm
        width={800}
        labelCol={{ span: 7 }}
        title={t("editMatchingRule")}
        initialValues={currentEditValue}
        visible={visible}
        onCancel={closeModal}
        onFinish={onFinish}
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true })}
      >
        <Form.Item label={t("ruleName")} name="name" rules={[...Rules.Required]}>
          <Input />
        </Form.Item>
        <Form.Item label={t("applicableBaby")} name="stage" rules={Rules.Required}>
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
            const stage = getFieldValue("stage");
            const startMonths = getFieldValue("startOfApplicableDays");
            const endMonths = getFieldValue("endOfApplicableDays");
            const lessonsOptions = CurriculumUtils.filterLessons(lessonOptions, stage, startMonths, endMonths).map(
              (lesson) => ({
                label: lesson.number,
                value: lesson.number,
              }),
            );
            const lessonArr = (currentEditValue.lessons || []).filter((a) =>
              lessonsOptions.filter((b) => a.value === b.value),
            );
            setFieldsValue({ lessons: lessonArr });
            return (
              <Form.Item label={t("sessionsIncluded")} name="lessons" rules={[...Rules.Required]}>
                <Select mode="multiple" labelInValue options={lessonsOptions}></Select>
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
            title: t("rule"),
            dataIndex: "name",
            width: 200,
          },
          {
            title: t("applicableBabyGrowthPeriod"),
            dataIndex: "stage",
            width: 400,
            render: (_, record) => {
              return `${t(CurriculumBabyStage[record.stage])} ${record.startOfApplicableDays}${t(
                "common:unit:day",
              )} - ${record.endOfApplicableDays}${t("common:unit:day")}`;
            },
          },
          {
            title: t("sessionsIncluded"),
            dataIndex: "lessons",
            render: renderDomain,
          },
          scheduleOperation(disabled, handleDelete, openEditModal, t),
        ]}
      />
    </Card>
  );
}
const renderDomain = (h) => h.map((v) => v.label).join("、");

const lessonOperation = (disabled, handleDelete, openEditModal, t) => {
  if (disabled) return {};
  return {
    title: (
      <>
        {t("operation")} &nbsp;
        {!disabled && (
          <Tooltip title={t("lessonOperationWarn")} placement="left">
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
              {t("delete")}
            </Button>
          </DeleteConfirmModal>
          <Button size="small" type="link" onClick={() => openEditModal(record, index)}>
            {t("edit")}
          </Button>
        </Space>
      );
    },
  };
};

const scheduleOperation = (disabled, handleDelete, openEditModal, t) => {
  if (disabled) return {};
  return {
    title: t("operation"),
    width: 200,
    align: "center",
    render(_, record, index) {
      if (disabled) return null;
      return (
        <Space size="large">
          <DeleteConfirmModal
            title={t("deleteRule")}
            content={t("deleteRuleConfirmation")}
            onConfirm={() => handleDelete(index)}
          >
            <Button size="small" type="link">
              {t("delete")}
            </Button>
          </DeleteConfirmModal>
          <Button size="small" type="link" onClick={() => openEditModal(record, index)}>
            {t("edit")}
          </Button>
        </Space>
      );
    },
  };
};
