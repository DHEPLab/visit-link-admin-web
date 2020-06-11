import React, { useState } from 'react';
import styled from 'styled-components';
import { Form, Input, Button, Alert } from 'antd';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { applyToken } from '../utils/token';
import { useDispatch, useSelector } from 'react-redux';
import { loadProfileSuccess } from '../actions';

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
      <Login>
        <h1>Healthy Future Admin Portal</h1>
        <p>Please sign in</p>
        {error && (
          <>
            <Alert message="您输入的账号名称/账户密码可能有误" type="error" showIcon />
            <br />
          </>
        )}
        <Form>
          <Form.Item>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoFocus
            />
          </Form.Item>
          <Form.Item>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              onPressEnter={handleSignIn}
            />
          </Form.Item>
        </Form>
        <Button
          type="primary"
          onClick={handleSignIn}
          loading={networks['/admin/authenticate'] > 0 || networks['/api/account/profile'] > 0}
        >
          Login
        </Button>
      </Login>
    </AbsoluteContainer>
  );
}

const AbsoluteContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: white;
`;

const Login = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding-bottom: 10%;
`;
