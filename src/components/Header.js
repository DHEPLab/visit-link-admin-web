import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

export default function ({ username, role, onNavigate, onLogout }) {
  return (
    <Header>
      <Logo>
        <img src={require('../assets/logo.png')} alt="Logo" />
      </Logo>
      <Content>
        <Welcome>
          <b>{username}</b>
          <Role>{role}</Role>
        </Welcome>
        <SplitLine />
        <StyledButton type="link" onClick={() => onNavigate('/profiles')}>
          个人中心
        </StyledButton>
        <SplitLine />
        <StyledButton type="link" onClick={() => onLogout()}>
          退出
        </StyledButton>
      </Content>
    </Header>
  );
}

const SplitLine = styled.div`
  width: 1px;
  height: 20px;
  background: #d0d0d0;
  margin: 0 20px;
`;

const Role = styled.span`
  margin-left: 14px;
  color: #8e8e93;
`;

const Welcome = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #9b9b9b;
  b {
    color: #001831;
  }
`;

const StyledButton = styled(Button)`
  font-weight: bold;
  font-size: 16px;
  padding: 0;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  padding-right: 30px;
`;

const Header = styled.header`
  height: 80px;
  width: 100%;
  background-color: white;
  display: flex;
  border-bottom: 2px solid #ff9472;
`;

const Logo = styled.div`
  width: 270px;
  height: 100%;
  display: flex;
  align-items: center;

  img {
    height: 50px;
    margin-left: 40px;
  }
`;
