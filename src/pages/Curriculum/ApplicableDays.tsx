import DayInput from "@/components/DayInput";
import { LessonFormValue } from "@/pages/Curriculum/schema/Lesson";
import { ScheduleFormValue } from "@/pages/Curriculum/schema/Schedule";
import { validateEndDate, validateEndDateRange, validateStartDateRange } from "@/pages/Curriculum/schema/validator";
import { Form } from "antd";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

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
          label={t("startOfApplicableDays")}
          labelCol={{ span: 0 }}
          rules={[startDateRequiredRule, validateStartDateRange(value, currentEditValue.id)]}
        >
          <DayInput style={{ width: "100%" }} />
        </DayInputItem>
        <ApplicableDaysConnector>{t("to")}</ApplicableDaysConnector>
        <DayInputItem
          name="endOfApplicableDays"
          label={t("endOfApplicableDays")}
          labelCol={{ span: 0 }}
          rules={[endDateRequiredRule, validateEndDate, validateEndDateRange(value, currentEditValue.id)]}
        >
          <DayInput style={{ width: "100%" }} />
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

const FieldsContainer = styled.div`
  width: 400px;
  display: flex;
`;

export default ApplicableDays;
