import AreaInput from "@/components/AreaInput";
import dayjs from "dayjs";
import { Select, Form, Input, Radio, DatePicker, Row, Col, InputNumber } from "antd";
import { useTranslation } from "react-i18next";

import ModalForm, { ModalFormProps } from "@/components/ModalForm";
import Rules from "@/constants/rules";
import { Gender, BabyStage, FeedingPattern } from "@/constants/enums";
import { disabledDateForEDC } from "./utils/dateLogic";
import { enumKeysIterator } from "@/utils/enumUtils";

export interface BabyModalFormValues {
  name: string;
  identity: string;
  gender: string;
  stage: "UNBORN" | "BORN";
  edc?: dayjs.Dayjs;
  birthday?: dayjs.Dayjs;
  assistedFood?: boolean;
  feedingPattern?:
    | "EXCLUSIVE_BREASTFEEDING"
    | "FORMULA_FEEDING"
    | "MIXED_BREAST_FORMULA_FEEDING"
    | "NO_BREAST_FORMULA_FEEDING";
  area: string[];
  location: string;
  longitude: number | null;
  latitude: number | null;
  remark: string | null;
}

export type BabyModalFormProps = ModalFormProps<BabyModalFormValues> & { disableStage?: boolean };

const BabyModalForm = ({ disableStage, ...props }: BabyModalFormProps) => {
  const { t } = useTranslation("baby");

  return (
    <ModalForm {...props} labelCol={{ span: 7 }} width={800}>
      <Form.Item label={t("name")} name="name" rules={Rules.RealName}>
        <Input autoFocus />
      </Form.Item>
      <Form.Item label={t("id")} name="identity" rules={Rules.Required}>
        <Input />
      </Form.Item>
      <Form.Item label={t("gender")} name="gender" rules={Rules.Required}>
        <Radio.Group>
          {enumKeysIterator(Gender).map((key) => (
            <Radio key={key} value={key}>
              {Gender[key]}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item label={t("growthStage")} name="stage" rules={Rules.Required}>
        <Radio.Group>
          {enumKeysIterator(BabyStage).map((key) => (
            <Radio key={key} value={key} disabled={disableStage}>
              {BabyStage[key]}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item noStyle shouldUpdate={(old, curr) => old.stage !== curr.stage}>
        {({ getFieldValue }) => {
          const stage = getFieldValue("stage");
          if (stage === "UNBORN") {
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
                    {enumKeysIterator(FeedingPattern).map((key) => (
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
      <Form.Item label={t("area")} name="area" rules={Rules.Required}>
        <AreaInput maxCount={1} />
      </Form.Item>
      <Form.Item label={t("address")} name="location" rules={Rules.Location}>
        <Input />
      </Form.Item>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label={t("longitude")} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} name="longitude">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={t("latitude")} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} name="latitude">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label={t("comments")} name="remark" rules={Rules.Remark}>
        <Input />
      </Form.Item>
    </ModalForm>
  );
};

export default BabyModalForm;
