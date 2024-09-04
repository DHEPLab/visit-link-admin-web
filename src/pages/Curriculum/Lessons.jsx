import { useNetworkStore } from "@/store/network";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/Card";
import { Button, Form, Input, Select, Space, Tooltip } from "antd";
import ModalForm from "@/components/ModalForm";
import Rules from "@/constants/rules";
import { validateLessonNumber } from "./utils";
import RadioEnum from "@/components/RadioEnum";
import ZebraTable from "@/components/ZebraTable";
import { CurriculumBabyStage } from "@/constants/enums";
import withEdit from "./withEdit";
import { InfoCircleFilled } from "@ant-design/icons";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import ApplicableDays from "./ApplicableDays";

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
  const requests = useNetworkStore((state) => state.requests);
  const { t } = useTranslation("curriculum");

  const [moduleOptions, setModuleOptions] = useState([]);
  const [questionnairesOptions, setQuestionnairesOptions] = useState([]);

  useEffect(() => {
    loadQuestionnairesOptions();
  }, [openEditModal, setQuestionnairesOptions]);

  function onFinish(formValues) {
    if (currentEditIndex === -1) {
      onChange(value.concat(formValues));
    } else {
      onChange(replace(value, currentEditIndex, { ...formValues, id: currentEditValue?.id }));
    }
    closeModal();
  }

  function handleDelete(index) {
    onChange(pullAt(value, index));
  }

  function loadModuleOptions() {
    axios
      .get("/admin/modules", {
        params: {
          size: 1000,
          published: true,
        },
      })
      .then(({ data }) => {
        setModuleOptions(data.content.map(({ number, id }) => ({ label: number, value: id })));
      });
  }

  function loadQuestionnairesOptions() {
    axios
      .get("/admin/questionnaires", {
        params: {
          size: 1000,
          published: true,
        },
      })
      .then(({ data }) => {
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
                  validateLessonNumber(value, number, currentEditIndex === -1 ? null : value[currentEditIndex].number)
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
            loading={!!requests["/admin/modules"]}
          />
        </Form.Item>
        <Form.Item label={t("survey")} name="questionnaire">
          <Select
            suffixIcon={null}
            options={questionnairesOptions}
            onFocus={loadQuestionnairesOptions}
            loading={!!requests["/admin/findAllQuestionnaires"]}
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
            render: (h) => h.map((v) => v.label).join("、"),
          },
          lessonOperation(disabled, handleDelete, openEditModal, t),
        ]}
      />
    </Card>
  );
}

const EnhancedLessons = withEdit(Lessons);
export default EnhancedLessons;
