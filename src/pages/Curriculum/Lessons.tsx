import ShadeButton from "@/components/ShadeButton";
import { ModuleListItem } from "@/models/res/Moduel";
import { Page } from "@/models/res/Page";
import { QuestionnaireListItem } from "@/models/res/Questionnaire";
import { LessonFormValue, LessonModule } from "@/pages/Curriculum/schema/Lesson";
import { useNetworkStore } from "@/store/network";
import { ColumnType } from "antd/es/table/interface";
import { DefaultOptionType } from "rc-select/lib/Select";
import { useTranslation, UseTranslationResponse } from "react-i18next";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/Card";
import { Button, Form, FormProps, Input, Select, Space, Tooltip } from "antd";
import ModalForm from "@/components/ModalForm";
import Rules from "@/constants/rules";
import { validateLessonNumber } from "./utils";
import RadioEnum from "@/components/RadioEnum";
import ZebraTable from "@/components/ZebraTable";
import { CurriculumBabyStage } from "@/constants/enums";
import { InfoCircleFilled } from "@ant-design/icons";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import ApplicableDays from "./ApplicableDays";
import useEdit from "./hooks/useEdit";

const lessonOperation = (
  readonly: boolean,
  handleDelete: (index: number) => void,
  openEditModal: (value: LessonFormValue, index: number) => void,
  t: UseTranslationResponse<"curriculum", undefined>["t"],
): ColumnType<LessonFormValue> => {
  if (readonly) return {};
  return {
    title: (
      <>
        {t("operation")} &nbsp;
        <Tooltip title={t("lessonOperationWarn")} placement="left">
          <InfoCircleFilled style={{ color: "#000" }} />
        </Tooltip>
      </>
    ),
    width: 200,
    align: "center",
    render(_value, record, index: number) {
      if (readonly) return null;
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
  } satisfies ColumnType<LessonFormValue>;
};

type LessonsProps = {
  readonly: boolean;
  lessons: LessonFormValue[];
  onChange: (lessons: LessonFormValue[]) => void;
};

const EmptySession = { stage: "EDC" } as LessonFormValue;

const Lessons: React.FC<LessonsProps> = ({ readonly, lessons, onChange }) => {
  const requests = useNetworkStore((state) => state.requests);
  const { t } = useTranslation("curriculum");
  const { visible, pullAt, replace, currentEditIndex, currentEditValue, openEditModal, openCreateModal, closeModal } =
    useEdit<LessonFormValue>();

  const [moduleOptions, setModuleOptions] = useState<DefaultOptionType[]>([]);
  const [questionnairesOptions, setQuestionnairesOptions] = useState<DefaultOptionType[]>([]);

  useEffect(() => {
    const abortController = new AbortController();
    loadQuestionnairesOptions(abortController.signal);
    return () => abortController.abort();
  }, []);

  function onFinish(formValues: LessonFormValue) {
    if (currentEditIndex === -1) {
      onChange(lessons.concat(formValues));
    } else {
      onChange(replace(lessons, currentEditIndex, { ...formValues, id: currentEditValue?.id }));
    }
    closeModal();
  }

  function handleDelete(index: number) {
    onChange(pullAt(lessons, index));
  }

  function loadModuleOptions() {
    axios
      .get<Page<ModuleListItem>>("/admin/modules", {
        params: {
          size: 1000,
          published: true,
        },
      })
      .then(({ data }) => {
        setModuleOptions(data.content.map(({ number, id }) => ({ label: number, value: id })));
      });
  }

  function loadQuestionnairesOptions(signal?: AbortSignal) {
    axios
      .get<Page<QuestionnaireListItem>>("/admin/questionnaires", {
        params: {
          size: 1000,
          published: true,
        },
        signal,
      })
      .then(({ data }) => {
        setQuestionnairesOptions(data?.content?.map(({ name, id }) => ({ label: name, value: id })));
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          throw error;
        }
      });
  }

  return (
    <Card
      noPadding
      title={t("sessions")}
      tooltip={
        !readonly && (
          <>
            <p>{t("pleaseNote")}</p>
            <p>{t("sessionApplicabilityWarning")}</p>
            <p>{t("modifyApplicabilityWarning")}</p>
          </>
        )
      }
      extra={!readonly && <ShadeButton onClick={() => openCreateModal(EmptySession)}>{t("addNewSession")}</ShadeButton>}
    >
      <ModalForm
        width={800}
        labelCol={{ span: 7 }}
        title={t("editSession")}
        visible={visible}
        initialValues={currentEditValue}
        onCancel={closeModal}
        onFinish={onFinish}
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true }) as FormProps["validateMessages"]}
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
                  validateLessonNumber(
                    lessons,
                    number,
                    currentEditIndex === -1 ? null : lessons[currentEditIndex].number,
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
        <ApplicableDays value={lessons} currentEditValue={currentEditValue} />
        <Form.Item label={t("modulesIncluded")} name="modules" rules={Rules.Required}>
          <Select
            mode="multiple"
            labelInValue
            options={moduleOptions}
            onFocus={loadModuleOptions}
            loading={!!requests["/admin/modules"]}
          />
        </Form.Item>
        <Form.Item label={t("survey")} name="questionnaire">
          <Select
            suffixIcon={null}
            options={questionnairesOptions}
            onFocus={() => loadQuestionnairesOptions()}
            loading={!!requests["/admin/findAllQuestionnaires"]}
          />
        </Form.Item>
        <Form.Item label={t("textSurvey")} name="smsQuestionnaireAddress" rules={[{ max: 100 }]}>
          <Input />
        </Form.Item>
      </ModalForm>

      <ZebraTable<LessonFormValue>
        rowKey="number"
        pagination={false}
        dataSource={lessons}
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
              return `${t(CurriculumBabyStage[record.stage as keyof typeof CurriculumBabyStage])} ${record.startOfApplicableDays}${t(
                "common:unit:day",
              )} - ${record.endOfApplicableDays}${t("common:unit:day")}`;
            },
          },
          {
            title: t("modulesIncluded"),
            dataIndex: "modules",
            render: (value: LessonModule[]) => value.map((module) => module.label).join("、"),
          },
          lessonOperation(readonly, handleDelete, openEditModal, t),
        ]}
      />
    </Card>
  );
};

export default Lessons;
