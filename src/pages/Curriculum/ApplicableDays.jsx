import { useTranslation } from "react-i18next";
import { Form, InputNumber } from "antd";
import CurriculumUtils from "@/utils/curriculum";
import styled from "styled-components";
import React from "react";

export default function ApplicableDays({ value, currentEditValue }) {
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
