import { useTranslation } from "react-i18next";
import Card from "@/components/Card";
import { Button, Form, Input, Select, Space } from "antd";
import ModalForm from "@/components/ModalForm";
import Rules from "@/constants/rules";
import RadioEnum from "@/components/RadioEnum";
import { filterLessons } from "./utils";
import ZebraTable from "@/components/ZebraTable";
import { CurriculumBabyStage } from "@/constants/enums";
import React from "react";
import withEdit from "./withEdit";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import ApplicableDays from "./ApplicableDays";

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
        value.concat({
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
            const lessonsOptions = filterLessons(lessonOptions, stage, startMonths, endMonths).map((lesson) => ({
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
            render: (h) => h.map((v) => v.label).join("、"),
          },
          scheduleOperation(disabled, handleDelete, openEditModal, t),
        ]}
      />
    </Card>
  );
}

const EnhancedSchedules = withEdit(Schedules);
export default EnhancedSchedules;
