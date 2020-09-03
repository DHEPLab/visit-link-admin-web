import React, { useState } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { Form, Input, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Rules from '../constants/rules';
import { applyToken } from '../utils/token';
import { apiAccountProfile } from '../actions';
import SignInBg from '../assets/signin-bg.png';
import { Message } from '../components/*';

export default function SignIn() {
  const history = useHistory();
  const dispatch = useDispatch();
  const networks = useSelector((state) => state.networks);

  const [form] = Form.useForm();
  const [error, setError] = useState(false);

  async function handleSignIn(values) {
    setError(false);
    try {
      const auth = await Axios.post('/admin/authenticate', values);
      applyToken(auth.data.idToken);

      const profile = await Axios.get('/api/account/profile');
      dispatch(apiAccountProfile(profile));

      Message.success('登录成功', '您已成功登录系统',1);
      history.push('/');
    } catch {
      setError(true);
    }
  }

  return (
    <AbsoluteContainer>
      <Container>
        <Logo src={require('../assets/logo.png')} />
        <Form form={form} onFinish={handleSignIn}>
          <Form.Item label="账户名" name="username" rules={Rules.Required} labelCol={{ span: 0 }}>
            <Input className="master" size="large" placeholder="请输入账户名" autoFocus />
          </Form.Item>
          <Form.Item label="账户密码" name="password" rules={Rules.Required} labelCol={{ span: 0 }}>
            <Input.Password
              className="master"
              size="large"
              placeholder="请输入账户密码"
              onPressEnter={form.submit}
            />
          </Form.Item>
        </Form>
        <ForgetPassword>
          {/* <Button size="small" type="link">
            忘记密码？
          </Button> */}
        </ForgetPassword>
        {error && <ErrorMessage>您输入的账号名称/账户密码可能有误</ErrorMessage>}
        <Button
          size="large"
          type="shade"
          onClick={form.submit}
          loading={networks['/admin/authenticate'] > 0 || networks['/api/account/profile'] > 0}
        >
          登录
        </Button>
      </Container>
    </AbsoluteContainer>
  );
}

const ForgetPassword = styled.div`
  width: 400px;
  text-align: right;
  margin-top: -12px;
  margin-bottom: 26px;
`;

const AbsoluteContainer = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 100;
  background: url(${SignInBg}) no-repeat left bottom;
  background-color: #fff;
`;

const ErrorMessage = styled.div`
  font-size: 14px;
  color: #ff2e2e;
  margin-bottom: 24px;
`;

const Logo = styled.img`
  width: 260px;
  margin-bottom: 60px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 23vh;
  margin-left: auto;
  width: 760px;
`;
