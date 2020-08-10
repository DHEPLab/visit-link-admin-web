import React from 'react';
import moment from 'moment';
import { Select, Form, Input, Radio, DatePicker, Cascader } from 'antd';

import ModalForm from './ModalForm';
import Pcas from '../constants/pcas-code.json';
import Rules from '../constants/rules';
import { Gender, BabyStage, FeedingPattern } from '../constants/enums';

export default function BabyModalForm({ disableStage, ...props }) {
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
          const stage = getFieldValue('stage');
          if (stage === 'EDC') {
            return (
              <Form.Item label="待产日期" name="edc" rules={Rules.Required}>
                <DatePicker
                  // Can not select days before today and today
                  disabledDate={(current) => current && current < moment().endOf('day')}
                />
              </Form.Item>
            );
          } else {
            return (
              <>
                <Form.Item label="出生日期" name="birthday" rules={Rules.Required}>
                  <DatePicker
                    // Can not select days after today
                    disabledDate={(current) => current && current > moment().endOf('day')}
                  />
                </Form.Item>
                <Form.Item label="辅食" name="assistedFood" rules={Rules.Required}>
                  <Radio.Group>
                    <Radio value={true}>已添加</Radio>
                    <Radio value={false}>未添加</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(old, curr) => old.assistedFood !== curr.assistedFood}
                >
                  {({ getFieldValue, setFieldsValue }) => {
                    // do not select BREAST_MILK, MILE_POWDER if added assisted food
                    const assistedFood = getFieldValue('assistedFood');
                    const feedingPattern = getFieldValue('feedingPattern');
                    function isValid(_assistedFood, _feedingPattern) {
                      if (!_assistedFood) return true;
                      return (
                        _assistedFood &&
                        _feedingPattern !== 'BREAST_MILK' &&
                        _feedingPattern !== 'MILK_POWDER'
                      );
                    }
                    if (!isValid(assistedFood, feedingPattern)) {
                      setFieldsValue({
                        feedingPattern: '',
                      });
                    }
                    return (
                      <Form.Item label="喂养方式" name="feedingPattern" rules={Rules.Required}>
                        <Select>
                          {Object.keys(FeedingPattern || [])
                            .filter((key) => isValid(assistedFood, key))
                            .map((key) => (
                              <Select.Option key={key} value={key}>
                                {FeedingPattern[key]}
                              </Select.Option>
                            ))}
                        </Select>
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </>
            );
          }
        }}
      </Form.Item>
      <Form.Item label="所在区域" name="area" rules={Rules.Required}>
        <Cascader
          options={Pcas}
          fieldNames={{ label: 'name', value: 'name', children: 'children' }}
        />
      </Form.Item>
      <Form.Item label="详细地址" name="location" rules={Rules.Location}>
        <Input />
      </Form.Item>
      <Form.Item label="备注信息" name="remark" rules={Rules.Remark}>
        <Input />
      </Form.Item>
    </ModalForm>
  );
}
