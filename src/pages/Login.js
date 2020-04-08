import React from 'react';
import styled from 'styled-components';
import { Form, Input, Button } from 'antd';

function Login() {
  return (
    <Container>
      <h1>Healthy Future Admin Portal</h1>
      <p>
        <h3>Please sign in</h3>
      </p>
      <Form>
        <Form.Item>
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary">Login</Button>
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
