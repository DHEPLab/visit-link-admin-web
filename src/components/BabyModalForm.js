import React from 'react';
import moment from 'moment';
import { Form, Input, Radio, Select, DatePicker } from 'antd';

import ModalForm from './ModalForm';
import { Required } from '../constants';
import { Gender, BabyStage, FeedingPattern } from '../constants/enums';

export default function (props) {
  return (
    <ModalForm {...props}>
      <Form.Item label="真实姓名" name="name" rules={Required}>
        <Input autoFocus />
      </Form.Item>
      <Form.Item label="ID" name="identity" rules={Required}>
        <Input />
      </Form.Item>
      <Form.Item label="性别" name="gender" rules={Required}>
        <Radio.Group>
          {Object.keys(Gender).map((key) => (
            <Radio key={key} value={key}>
              {Gender[key]}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item label="成长阶段" name="stage" rules={Required}>
        <Radio.Group>
          {Object.keys(BabyStage).map((key) => (
            <Radio key={key} value={key}>
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
              <Form.Item label="待产日期" name="edc" rules={Required}>
                <DatePicker
                  // Can not select days before today and today
                  disabledDate={(current) => current && current < moment().endOf('day')}
                />
              </Form.Item>
            );
          } else {
            return (
              <>
                <Form.Item label="出生日期" name="birthday" rules={Required}>
                  <DatePicker
                    // Can not select days after today
                    disabledDate={(current) => current && current > moment().endOf('day')}
                  />
                </Form.Item>
                <Form.Item label="喂养方式" name="feedingPattern" rules={Required}>
                  <Select>
                    {Object.keys(FeedingPattern).map((key) => (
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
      <Form.Item label="详细地址" name="location" rules={Required}>
        <Input />
      </Form.Item>
      <Form.Item label="备注信息" name="remark">
        <Input />
      </Form.Item>
    </ModalForm>
  );
}
