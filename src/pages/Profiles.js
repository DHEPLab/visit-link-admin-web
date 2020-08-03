import React from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Form, Input } from 'antd';

import Rules from '../constants/rules';
import { useBoolState } from '../utils';
import { Role } from '../constants/enums';
import { clearToken } from '../utils/token';
import { Card, StaticField, ModalForm, Message } from '../components/*';
import { apiAccountProfile } from '../actions';

export default function Profiles() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const [visible, openPasswordModal, closePasswordModal] = useBoolState(false);
  const [visibleProfile, openProfileModal, closeProfileModal] = useBoolState(false);

  async function handleChangeProfile(values) {
    await Axios.put('/api/account/profile', values);
    dispatch(apiAccountProfile(await Axios.get('/api/account/profile')));
    closeProfileModal();
  }

  async function handleChangePassword(values) {
    await Axios.put('/api/account/password', values);
    Message.success('密码修改成功', '请您重新登录');
    clearToken();
    history.push('/sign_in');
  }

  return (
    <>
      <ContentHeader title="个人中心" />

      <Card
        title="基本信息"
        extra={
          <Button type="shade" onClick={openProfileModal}>
            编辑资料
          </Button>
        }
      >
        <StaticField label="真实姓名">{user.realName}</StaticField>
        <StaticField label="联系电话">{user.phone}</StaticField>
        <StaticField label="权限">{Role[user.role]}</StaticField>
      </Card>

      <Card
        title="账户信息"
        extra={
          <Button type="shade" onClick={openPasswordModal}>
            修改密码
          </Button>
        }
      >
        <StaticField label="账户名称">{user.username}</StaticField>
        <StaticField label="账户密码">******</StaticField>
      </Card>

      <ModalForm
        title="编辑基本信息"
        visible={visibleProfile}
        initialValues={user}
        onFinish={handleChangeProfile}
        onCancel={closeProfileModal}
      >
        <Form.Item label="真实姓名" name="realName" rules={Rules.Required}>
          <Input />
        </Form.Item>
        <Form.Item label="联系电话" name="phone" rules={Rules.Phone}>
          <Input />
        </Form.Item>
      </ModalForm>

      <ModalForm
        title="修改密码"
        visible={visible}
        onFinish={handleChangePassword}
        onCancel={closePasswordModal}
      >
        <Form.Item label="旧密码" name="oldPassword" rules={Rules.Required}>
          <Input.Password></Input.Password>
        </Form.Item>
        <Form.Item label="新密码" name="password" rules={Rules.Password}>
          <Input.Password></Input.Password>
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="confirmPassword"
          rules={[
            ...Rules.Required,
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('两次密码输入不一致');
              },
            }),
          ]}
        >
          <Input.Password></Input.Password>
        </Form.Item>
      </ModalForm>
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
