import React, { useState } from 'react';
import styled from 'styled-components';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { applyToken } from '../utils/token';

export default function () {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  let history = useHistory();

  function handleLogin() {
    axios.post('/api/authenticate', { username, password }).then((response) => {
      applyToken(response.data.idToken);
      history.push('/');
    });
  }

  return (
    <AbsoluteContainer>
      <Login>
        <h1>Healthy Future Admin Portal</h1>
        <p>Please sign in</p>
        <Form>
          <Form.Item>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              onPressEnter={handleLogin}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleLogin}>
              Login
            </Button>
          </Form.Item>
        </Form>
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
