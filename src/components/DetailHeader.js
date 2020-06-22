import React from 'react';
import styled from 'styled-components';

export default function ({ menu, title, extra }) {
  return (
    <Container>
      <Flex>
        <Menu>{menu}</Menu>
        <Title>{title}</Title>
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

const Flex = styled.div`
  display: flex;
`;

const Menu = styled.div`
  color: #ff794f;
  font-weight: 500;
`;

const Title = styled.div`
  font-weight: bold;
  margin-left: 20px;
`;
