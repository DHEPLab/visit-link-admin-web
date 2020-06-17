import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { Role } from '../constants/enums';
import { Card, StaticField } from '../components/*';

export default function Profiles() {
  const { user } = useSelector((state) => state.users);

  return (
    <>
      <ContentHeader title="个人中心" />
      <Card title="基本信息">
        <StaticField label="真实姓名">{user.realName}</StaticField>
        <StaticField label="联系电话">{user.phone}</StaticField>
        <StaticField label="权限">{Role[user.role]}</StaticField>
      </Card>
      <Card title="账户信息">
        <StaticField label="账户名称">{user.username}</StaticField>
        <StaticField label="账户密码">******</StaticField>
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
