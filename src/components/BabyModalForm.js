import React from 'react';
import moment from 'moment';
import { Form, Input, Radio, DatePicker, Cascader } from 'antd';

import ModalForm from './ModalForm';
import SelectEnum from './SelectEnum';
import Pcas from '../constants/pcas-code.json';
import { Required } from '../constants';
import { Gender, BabyStage } from '../constants/enums';

export default function BabyModalForm({ disableStage, ...props }) {
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
                  <SelectEnum name="FeedingPattern" />
                </Form.Item>
              </>
            );
          }
        }}
      </Form.Item>
      <Form.Item label="所在区域" name="area" rules={Required}>
        <Cascader
          options={Pcas}
          fieldNames={{ label: 'name', value: 'name', children: 'children' }}
        />
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
