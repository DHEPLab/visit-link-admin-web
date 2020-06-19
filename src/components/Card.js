import React from 'react';
import styled from 'styled-components';

export default function ({ title, children, extra, noPadding }) {
  return (
    <Card>
      <TitleContainer>
        <Title>{title}</Title>
        <div>{extra}</div>
      </TitleContainer>
      <Content noPadding={noPadding}>{children}</Content>
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
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #4a4a4a;
`;

const Content = styled.div`
  ${({ noPadding }) => !noPadding && 'padding: 20px;'}
`;
