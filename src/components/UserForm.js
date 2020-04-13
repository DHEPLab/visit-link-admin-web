import React from 'react';
import { Input, Form, Select } from 'antd';
import styled from 'styled-components';

export default function () {
  return (
    <StyledForm
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
    >
      <Form.Item label="Account Type">
        <Select defaultValue="ROLE_ADMIN" style={{ width: 180 }}>
          <Option value="ROLE_ADMIN">Super Admin</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Username">
        <Input />
      </Form.Item>
      <Form.Item label="Password">
        <Input.Password />
      </Form.Item>
      <Form.Item label="Name">
        <Input />
      </Form.Item>
      <Form.Item label="Phone">
        <Input />
      </Form.Item>
      <Form.Item label="Email">
        <Input />
      </Form.Item>
      <Form.Item label="Wechat">
        <Input />
      </Form.Item>
    </StyledForm>
  );
}
const { Option } = Select;
const StyledForm = styled(Form)`
  padding-left: 20px;
`;
