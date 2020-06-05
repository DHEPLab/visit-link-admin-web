import React from 'react';
import styled from 'styled-components';

export default function ({ title, children }) {
  return (
    <Card>
      <TitleContainer>
        <Title>{title}</Title>
      </TitleContainer>
      <Content>{children}</Content>
    </Card>
  );
}

const Card = styled.div`
  background: #fff;
  margin-bottom: 20px;
`;

const TitleContainer = styled.div`
  border-bottom: 2px solid #eee;
  height: 70px;
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #4a4a4a;
  margin-left: 50px;
`;

const Content = styled.div`
  padding: 20px;
`;
