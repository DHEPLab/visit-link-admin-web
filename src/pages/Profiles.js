import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { Role } from '../constants/enums';
import { Card, StaticFormItem } from '../components/*';

export default function Profiles() {
  const { user } = useSelector((state) => state.users);

  return (
    <>
      <ContentHeader title="个人中心" />
      <Card title="基本信息">
        <StaticFormItem label="真实姓名">{user.realName}</StaticFormItem>
        <StaticFormItem label="联系电话">{user.phone}</StaticFormItem>
        <StaticFormItem label="权限">{Role[user.role]}</StaticFormItem>
      </Card>
      <Card title="账户信息">
        <StaticFormItem label="账户名称">{user.username}</StaticFormItem>
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
