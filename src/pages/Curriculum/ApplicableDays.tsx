import { LessonFormValue } from "@/pages/Curriculum/schema/Lesson";
import { ScheduleFormValue } from "@/pages/Curriculum/schema/Schedule";
import { Form, InputNumber } from "antd";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { validateLessonDateRange } from "./utils";

type ApplicableDaysProps<T> = {
  value: T[];
  currentEditValue: T;
};

const ApplicableDays = <T extends LessonFormValue | ScheduleFormValue>({
  value,
  currentEditValue,
}: ApplicableDaysProps<T>) => {
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
    <Form.Item wrapperCol={{ offset: 7 }} shouldUpdate={(pre, cur) => pre.stage !== cur.stage}>
      <FieldsContainer>
        <DayInputItem
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
                  validateLessonDateRange(value, {
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
          <DayInput min={1} max={9999} precision={0} suffix={t("common:unit.day")} />
        </DayInputItem>
        <ApplicableDaysConnector>{t("to")}</ApplicableDaysConnector>
        <DayInputItem
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
                  validateLessonDateRange(value, {
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
          <DayInput min={1} max={9999} precision={0} suffix={t("common:unit.day")} />
        </DayInputItem>
      </FieldsContainer>
    </Form.Item>
  );
};

const ApplicableDaysConnector = styled.div`
  display: inline-block;
  margin: 8px 14px 0;
`;

const DayInputItem = styled(Form.Item)`
  display: inline-block;
  flex: 1;
`;

const DayInput = styled(InputNumber)`
  width: 100%;
`;

const FieldsContainer = styled.div`
  width: 400px;
  display: flex;

  // This is workaround for cursor display when input number set the suffix

  .ant-input-number-input {
    border-radius: 0;
  }
`;

export default ApplicableDays;
