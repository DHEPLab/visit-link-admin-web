import dayjs from "dayjs";
import { Select, Form, Input, Radio, DatePicker, Cascader, Row, Col, InputNumber, AutoComplete } from "antd";
import { useTranslation } from "react-i18next";

import ModalForm, { ModalFormProps } from "@/components/ModalForm";
import Pcas from "@/constants/pcas-code.json";
import Rules from "@/constants/rules";
import { Gender, BabyStage, FeedingPattern } from "@/constants/enums";
import i18n from "@/i18n";
import { disabledDateForEDC } from "./utils/dateLogic";
import { enumKeysIterator } from "@/utils/enumUtils";
import { useEffect, useRef, useState } from "react";
import { debounce } from "radash";

export interface BabyModalFormValues {
  name: string;
  identity: string;
  gender: string;
  stage: "EDC" | "BIRTH";
  edc?: dayjs.Dayjs;
  birthday?: dayjs.Dayjs;
  assistedFood?: boolean;
  feedingPattern?: "BREAST_MILK" | "MILK_POWDER" | "MIXED" | "TERMINATED";
  area: string;
  location: string;
  longitude: number | null;
  latitude: number | null;
  remark: string | null;
}

interface AreaOption {
  value: string;
  placeId: string;
}

export type BabyModalFormProps = ModalFormProps<BabyModalFormValues> & { disableStage?: boolean };

const BabyModalForm = ({ disableStage, ...props }: BabyModalFormProps) => {
  const { t } = useTranslation("baby");
  const formRef = useRef(null);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const mapRef = useRef(null);
  const [options, setOptions] = useState<AreaOption[]>([]);

  useEffect(() => {
    if (!autocompleteService.current && window.google) {
      initMapServices();
    }
  }, []);

  const initMapServices = () => {
    mapRef.current = new window.google.maps.Map(document.createElement("div"));
    autocompleteService.current = new window.google.maps.places.AutocompleteService();
    placesService.current = new window.google.maps.places.PlacesService(mapRef.current);
  };

  const handleSearchArea = (value: string): void => {
    autocompleteService.current.getPlacePredictions({ input: value }, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        const newOptions = predictions.map((prediction) => ({
          value: prediction.description,
          placeId: prediction.place_id, // Store place_id for fetching details
        }));
        setOptions(newOptions);
      }
    });
  };
  const handleSelectArea = (value: string, option: AreaOption) => {
    placesService.current.getDetails({ placeId: option.placeId }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const { geometry } = place;
        const latitude = geometry.location.lat();
        const longitude = geometry.location.lng();
        formRef.current.form.setFieldsValue({ latitude, longitude });
      }
    });
  };

  return (
    <ModalForm {...props} labelCol={{ span: 7 }} width={800} ref={formRef}>
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
      {i18n.resolvedLanguage === "zh" ? (
        <Form.Item label={t("area")} name="area" rules={Rules.Required}>
          <Cascader options={Pcas} fieldNames={{ label: "name", value: "name", children: "children" }} />
        </Form.Item>
      ) : (
        <Form.Item label={t("area")} name="area" rules={Rules.Required}>
          <AutoComplete
            onSearch={debounce({ delay: 200 }, handleSearchArea)}
            onSelect={handleSelectArea}
            placeholder="input here"
            options={options}
          />
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
};

export default BabyModalForm;
