import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useParams } from 'react-router-dom';
import { Card, StaticFormItem } from '../components/*';
import Axios from 'axios';

export default function User() {
  const { id } = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    Axios.get(`/admin/user/${id}`).then(({ data }) => setUser(data));
  }, [id]);

  return (
    <>
      <h2>账户管理详情</h2>
      <Card title="用户信息" extra={<Button type="link">编辑资料</Button>}>
        <StaticFormItem label="真实姓名">{user.realName}</StaticFormItem>
        <StaticFormItem label="联系电话">{user.phone}</StaticFormItem>
        <StaticFormItem label="权限">{user.role}</StaticFormItem>
      </Card>
      <br />
      <Card title="账户信息" extra={<Button type="link">修改密码</Button>}>
        <StaticFormItem label="账户名称">{user.username}</StaticFormItem>
        <StaticFormItem label="账户密码">******</StaticFormItem>
      </Card>
      <br />
      <Card title="管理工作人员列表" extra={<Button type="link">分配新工作人员</Button>}></Card>
    </>
  );
}
