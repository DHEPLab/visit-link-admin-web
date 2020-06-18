import React, { useState } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { Form, Input, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { applyToken } from '../utils/token';
import { loadProfileSuccess } from '../actions';
import SignInBg from '../assets/signin-bg.png';

export default function () {
  const history = useHistory();
  const dispatch = useDispatch();
  const networks = useSelector((state) => state.networks);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  async function handleSignIn() {
    setError(false);
    try {
      const auth = await Axios.post('/admin/authenticate', { username, password });
      applyToken(auth.data.idToken);
      const profile = await Axios.get('/api/account/profile');
      dispatch(loadProfileSuccess(profile));
      history.push('/');
    } catch {
      setError(true);
    }
  }

  return (
    <AbsoluteContainer>
      <SignIn>
        <Logo src={require('../assets/logo.png')} />
        <Form>
          <Form.Item>
            <Input
              size="large"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入账户名"
              autoFocus
            />
          </Form.Item>
          <Form.Item>
            <Input.Password
              size="large"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入账户密码"
              onPressEnter={handleSignIn}
            />
          </Form.Item>
        </Form>
        {error && <ErrorMessage>您输入的账号名称/账户密码可能有误</ErrorMessage>}
        <Button
          size="large"
          type="primary"
          onClick={handleSignIn}
          loading={networks['/admin/authenticate'] > 0 || networks['/api/account/profile'] > 0}
        >
          登录
        </Button>
      </SignIn>
    </AbsoluteContainer>
  );
}

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

const SignIn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 23vh;
  margin-left: auto;
  width: 760px;
`;
