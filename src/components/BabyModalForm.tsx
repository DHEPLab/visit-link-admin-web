import dayjs from "dayjs";
import { Select, Form, Input, Radio, DatePicker, Row, Col, InputNumber, AutoComplete } from "antd";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import axios from "axios";

import ModalForm, { ModalFormProps, ModalFormRef } from "@/components/ModalForm";
import Rules from "@/constants/rules";
import { Gender, BabyStage, FeedingPattern } from "@/constants/enums";
import { disabledDateForEDC } from "./utils/dateLogic";
import { enumKeysIterator } from "@/utils/enumUtils";
import { BaseSyntheticEvent, Ref, useRef, useState } from "react";

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

export type PlaceAutocomplete = {
  predictions: {
    description: string;
    place_id: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
    };
  }[];
  status: string;
};

export type GeoLocation = {
  name: string;
  lat: number;
  lng: number;
};

export type AreaOption = {
  id: string;
  value: string;
};

const BabyModalForm = ({ disableStage, ...props }: BabyModalFormProps) => {
  const { t } = useTranslation("baby");

  const formRef = useRef<ModalFormRef>();
  const [options, setOptions] = useState<AreaOption[]>([]);

  const handleSearchArea = (value: string): void => {
    axios.get<PlaceAutocomplete>(`/admin/babies/place/autocomplete?area=${value}`).then(({ data }) => {
      if (data.status === "OK") {
        const options = data.predictions.map((prediction) => ({
          id: prediction.place_id,
          value: prediction.description,
        }));
        setOptions(options);
      } else {
        setOptions([]);
      }
    });
  };

  const handleSelectArea = (_: string, option: AreaOption) => {
    axios.get<GeoLocation>(`/admin/babies/place/location?placeId=${option.id}`).then(({ data: geo }) => {
      formRef.current?.form?.setFieldsValue({
        latitude: geo.lat,
        longitude: geo.lng,
      });
    });
  };

  const handleFreeTextSearch = (e: BaseSyntheticEvent) => {
    const area = e.target.value;

    const isSlectedOption = area && options.some((opt) => opt.value === area);
    if (!isSlectedOption) {
      axios
        .get<GeoLocation>(`/admin/babies/place/location?area=${area}`)
        .then(({ data: geo }) => {
          formRef.current?.form?.setFieldsValue({
            latitude: geo.lat,
            longitude: geo.lng,
          });
        })
        .catch(() => {
          formRef.current?.form?.setFieldsValue({
            latitude: undefined,
            longitude: undefined,
          });
        });
    }
  };

  return (
    <ModalForm {...props} labelCol={{ span: 7 }} width={800} ref={formRef as Ref<ModalFormRef>}>
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
        <AutoComplete
          onSearch={debounce(handleSearchArea, 500)}
          onSelect={handleSelectArea}
          onBlur={handleFreeTextSearch}
          placeholder="England, London, Argyle Street 10, ABC Building"
          options={options}
        />
      </Form.Item>
      <Form.Item label={t("address")} name="location" rules={Rules.Location}>
        <Input placeholder={t("detailAddressPlaceholder")} />
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
};

export default BabyModalForm;
