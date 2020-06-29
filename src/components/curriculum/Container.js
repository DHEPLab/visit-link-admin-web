import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

export default function Container({ title, children, onRemove }) {
  return (
    <StyledContainer>
      <TitleContainer>
        <Title>{title}</Title>
        <Button size="small" type="link" onClick={onRemove}>
          移除
        </Button>
      </TitleContainer>
      <Body>{children}</Body>
    </StyledContainer>
  );
}

const TitleContainer = styled.div`
  display: flex;
  height: 40px;
  padding: 0 30px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
`;

const StyledContainer = styled.div`
  border: 1px solid #eee;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Title = styled.div`
  font-weight: bold;
  color: #8e8e93;
`;

const Body = styled.div`
  padding: 10px;
`;
