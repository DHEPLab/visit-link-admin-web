import React from "react";
import dayjs from "dayjs";
import { Select, Form, Input, Radio, DatePicker, Cascader, Row, Col, InputNumber } from "antd";
import { useTranslation } from "react-i18next";

import ModalForm from "./ModalForm";
import Pcas from "../constants/pcas-code.json";
import Rules from "../constants/rules";
import { Gender, BabyStage, FeedingPattern } from "../constants/enums";
import i18n from "../i18n";

export function useMethods() {
  return {
    disabledDateForEDC(date, baseline) {
      if (!date) return false;
      const start = dayjs(baseline).format("YYYY-MM-DD");
      // days of edc is 280
      const end = dayjs(baseline).add(280, "day").format("YYYY-MM-DD");
      return !dayjs(dayjs(date).format("YYYY-MM-DD")).isBetween(start, end, undefined, "(]");
    },
  };
}

export default function BabyModalForm({ disableStage, ...props }) {
  const { t } = useTranslation("baby");
  const { disabledDateForEDC } = useMethods();
  return (
    <ModalForm {...props} labelCol={{ span: 7 }}>
      <Form.Item label={t("name")} name="name" rules={Rules.RealName}>
        <Input autoFocus />
      </Form.Item>
      <Form.Item label={t("id")} name="identity" rules={Rules.Required}>
        <Input />
      </Form.Item>
      <Form.Item label={t("gender")} name="gender" rules={Rules.Required}>
        <Radio.Group>
          {Object.keys(Gender).map((key) => (
            <Radio key={key} value={key}>
              {Gender[key]}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item label={t("growthStage")} name="stage" rules={Rules.Required}>
        <Radio.Group>
          {Object.keys(BabyStage).map((key) => (
            <Radio key={key} value={key} disabled={disableStage}>
              {BabyStage[key]}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item noStyle shouldUpdate={(old, curr) => old.stage !== curr.stage}>
        {({ getFieldValue }) => {
          const stage = getFieldValue("stage");
          if (stage === "EDC") {
            return (
              <Form.Item label={t("dueDay")} name="edc" rules={Rules.Required}>
                <DatePicker disabledDate={(current) => disabledDateForEDC(current, dayjs())} />
              </Form.Item>
            );
          } else {
            return (
              <>
                <Form.Item label={t("birthDay")} name="birthday" rules={Rules.Required}>
                  <DatePicker
                    // Can not select days after today
                    disabledDate={(current) => current && current > dayjs().endOf("day")}
                  />
                </Form.Item>
                <Form.Item label={t("supplementaryFood")} name="assistedFood" rules={Rules.Required}>
                  <Radio.Group>
                    <Radio value={true}>{t("add")}</Radio>
                    <Radio value={false}>{t("noAdd")}</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label={t("feedingMethods")} name="feedingPattern" rules={Rules.Required}>
                  <Select>
                    {Object.keys(FeedingPattern || []).map((key) => (
                      <Select.Option key={key} value={key}>
                        {FeedingPattern[key]}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            );
          }
        }}
      </Form.Item>
      {i18n.resolvedLanguage === "zh" ? (
        <Form.Item label={t("area")} name="area" rules={Rules.Required}>
          <Cascader options={Pcas} fieldNames={{ label: "name", value: "name", children: "children" }} />
        </Form.Item>
      ) : (
        <Form.Item label={t("area")} name="area" rules={Rules.Required}>
          <Input />
        </Form.Item>
      )}
      <Form.Item label={t("address")} name="location" rules={Rules.Location}>
        <Input />
      </Form.Item>
      <Row>
        <Col span={9} offset={4}>
          <Form.Item label={t("longitude")} labelCol={{ span: 8 }} name="longitude">
            <InputNumber style={{ width: 160 }} />
          </Form.Item>
        </Col>
        <Col span={9} style={{ paddingLeft: 6 }}>
          <Form.Item label={t("latitude")} labelCol={{ span: 4 }} name="latitude">
            <InputNumber style={{ width: 160 }} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label={t("comments")} name="remark" rules={Rules.Remark}>
        <Input />
      </Form.Item>
    </ModalForm>
  );
}
