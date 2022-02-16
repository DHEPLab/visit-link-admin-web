import React from "react";
import moment from "moment";
import { Select, Form, Input, Radio, DatePicker, Cascader, Row, Col, InputNumber } from "antd";

import ModalForm from "./ModalForm";
import Pcas from "../constants/pcas-code.json";
import Rules from "../constants/rules";
import { Gender, BabyStage, FeedingPattern } from "../constants/enums";

export function useMethods() {
  return {
    disabledDateForEDC(date, baseline) {
      if (!date) return false;
      const start = moment(baseline).format("YYYY-MM-DD");
      // days of edc is 280
      const end = moment(baseline).add(280, "day").format("YYYY-MM-DD");
      return !moment(moment(date).format("YYYY-MM-DD")).isBetween(start, end, undefined, "(]");
    },
  };
}

export default function BabyModalForm({ disableStage, ...props }) {
  const { disabledDateForEDC } = useMethods();
  return (
    <ModalForm {...props}>
      <Form.Item label="真实姓名" name="name" rules={Rules.RealName}>
        <Input autoFocus />
      </Form.Item>
      <Form.Item label="ID" name="identity" rules={Rules.Required}>
        <Input />
      </Form.Item>
      <Form.Item label="性别" name="gender" rules={Rules.Required}>
        <Radio.Group>
          {Object.keys(Gender).map((key) => (
            <Radio key={key} value={key}>
              {Gender[key]}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item label="成长阶段" name="stage" rules={Rules.Required}>
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
              <Form.Item label="预产期" name="edc" rules={Rules.Required}>
                <DatePicker disabledDate={(current) => disabledDateForEDC(current, moment())} />
              </Form.Item>
            );
          } else {
            return (
              <>
                <Form.Item label="出生日期" name="birthday" rules={Rules.Required}>
                  <DatePicker
                    // Can not select days after today
                    disabledDate={(current) => current && current > moment().endOf("day")}
                  />
                </Form.Item>
                <Form.Item label="辅食" name="assistedFood" rules={Rules.Required}>
                  <Radio.Group>
                    <Radio value={true}>已添加</Radio>
                    <Radio value={false}>未添加</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="喂养方式" name="feedingPattern" rules={Rules.Required}>
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
      <Form.Item label="所在区域" name="area" rules={Rules.Required}>
        <Cascader options={Pcas} fieldNames={{ label: "name", value: "name", children: "children" }} />
      </Form.Item>
      <Form.Item label="详细地址" name="location" rules={Rules.Location}>
        <Input />
      </Form.Item>
      <Row>
        <Col span={10} offset={1}>
          <Form.Item label="经度" name="longitude">
            <InputNumber style={{ width: 160 }} />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item label="纬度" name="latitude">
            <InputNumber style={{ width: 160 }} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="备注信息" name="remark" rules={Rules.Remark}>
        <Input />
      </Form.Item>
    </ModalForm>
  );
}
