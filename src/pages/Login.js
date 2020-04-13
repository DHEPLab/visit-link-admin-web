import React, { useState } from 'react';
import styled from 'styled-components';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { applyToken } from '../utils/token';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  let history = useHistory();

  function handleLogin() {
    axios
      .post('/api/authenticate', { username, password })
      .then((response) => {
        applyToken(response.data.idToken);
        history.push('/');
      })
      .catch((error) => {
        message.error(error.response.data.detail);
      });
  }

  return (
    <Container>
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
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleLogin}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80%;
`;

export default Login;
