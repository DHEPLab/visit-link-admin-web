import React from 'react';
import styled from 'styled-components';
import { Card, StaticFormItem } from '../components/*';

export default function () {
  return (
    <>
      <ContentHeader title="个人中心" />
      <Card title="基本信息">
        <StaticFormItem label="真实姓名">Personal</StaticFormItem>
        <StaticFormItem label="联系电话">Personal</StaticFormItem>
        <StaticFormItem label="权限">Personal</StaticFormItem>
      </Card>
      <Card title="账户信息">
        <StaticFormItem label="账户名称">Personal</StaticFormItem>
        <StaticFormItem label="账户密码">******</StaticFormItem>
      </Card>
    </>
  );
}

function ContentHeader({ title }) {
  return <ContentHeaderView>{title}</ContentHeaderView>;
}

const ContentHeaderView = styled.div`
  height: 76px;
  line-height: 76px;
  background: #fff;
  color: #ff794f;
  font-size: 24px;
  font-weight: bold;
  padding-left: 40px;
  margin-bottom: 20px;
`;
