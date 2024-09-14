import Card from "@/components/Card";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import ModalForm from "@/components/ModalForm";
import RadioEnum from "@/components/RadioEnum";
import ShadeButton from "@/components/ShadeButton";
import ZebraTable from "@/components/ZebraTable";
import { CurriculumBabyStage } from "@/constants/enums";
import Rules from "@/constants/rules";
import { LessonFormValue } from "@/pages/Curriculum/schema/Lesson";
import { ScheduleFormValue, ScheduleLesson } from "@/pages/Curriculum/schema/Schedule";
import { Button, Form, FormProps, Input, Select, Space } from "antd";
import { ColumnType } from "antd/es/table/interface";
import React from "react";
import { useTranslation, UseTranslationResponse } from "react-i18next";
import ApplicableDays from "./ApplicableDays";
import useEdit from "./hooks/useEdit";
import { filterLessons } from "./utils";

const scheduleOperation = (
  readonly: boolean,
  handleDelete: (index: number) => void,
  openEditModal: (value: ScheduleFormValue, index: number) => void,
  t: UseTranslationResponse<"curriculum", undefined>["t"],
): ColumnType<ScheduleFormValue> => {
  if (readonly) return {};
  return {
    title: t("operation"),
    width: 200,
    align: "center",
    render(_value, record, index) {
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
  } satisfies ColumnType<ScheduleFormValue>;
};

type SchedulesProps = {
  readonly: boolean;
  schedules: ScheduleFormValue[];
  lessons: LessonFormValue[];
  onChange: (schedules: ScheduleFormValue[]) => void;
};

const EmptySchedule = { stage: "EDC" } as ScheduleFormValue;

const Schedules: React.FC<SchedulesProps> = ({ readonly, schedules, lessons, onChange }) => {
  const { t } = useTranslation("curriculum");
  const { visible, pullAt, replace, currentEditIndex, currentEditValue, openEditModal, openCreateModal, closeModal } =
    useEdit<ScheduleFormValue>();

  function onFinish(formValues: ScheduleFormValue) {
    if (currentEditIndex === -1) {
      onChange(
        schedules.concat({
          ...formValues,
          lessons: formValues.lessons.map((lesson) => ({ label: lesson.label })),
        }),
      );
    } else {
      onChange(replace(schedules, currentEditIndex, { ...formValues, id: currentEditValue?.id }));
    }
    closeModal();
  }

  function handleDelete(index: number) {
    onChange(pullAt(schedules, index));
  }

  return (
    <Card
      title={t("curriculumRangeMatchingRule")}
      extra={!readonly && <ShadeButton onClick={() => openCreateModal(EmptySchedule)}>{t("addRule")}</ShadeButton>}
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
        validateMessages={t("validateMessages", { ns: "common", returnObjects: true }) as FormProps["validateMessages"]}
      >
        <Form.Item label={t("ruleName")} name="name" rules={[...Rules.Required]}>
          <Input />
        </Form.Item>
        <Form.Item label={t("applicableBaby")} name="stage" rules={Rules.Required}>
          <RadioEnum name="CurriculumBabyStage" />
        </Form.Item>
        <ApplicableDays value={schedules} currentEditValue={currentEditValue} />
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
            const lessonsOptions = filterLessons(lessons, stage, startMonths, endMonths).map((lesson) => ({
              label: lesson.number,
              value: lesson.number,
            }));
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
        dataSource={schedules}
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
            render: (lessons: ScheduleLesson[]) => lessons.map((lesson) => lesson.label).join("、"),
          },
          scheduleOperation(readonly, handleDelete, openEditModal, t),
        ]}
      />
    </Card>
  );
};

export default Schedules;
