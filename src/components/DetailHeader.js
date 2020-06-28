import React from 'react';
import styled from 'styled-components';

export default function ({ menu, title, role, extra }) {
  return (
    <Container>
      <Flex>
        <Menu>{menu}</Menu>
        <Title>{title}</Title>
        {role && <Role>{role}</Role>}
      </Flex>
      {extra}
    </Container>
  );
}

const Container = styled.div`
  height: 76px;
  background: #fff;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Role = styled.div`
  padding: 4px 20px;
  border-radius: 4px;
  background: #eee;
  color: #4a4a4a99;
  margin-left: 30px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Menu = styled.div`
  color: #ff794f;
  font-weight: 500;
`;

const Title = styled.div`
  font-weight: bold;
  margin-left: 20px;
`;
