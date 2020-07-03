import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

export default function Container({ name, title, children, onRemove, onActive, activeName }) {
  return (
    <StyledContainer active={name === activeName}>
      <TitleContainer onClick={() => onActive(name)}>
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
  cursor: pointer;
`;

const StyledContainer = styled.div`
  border: 1px solid #eee;
  border-radius: 10px;
  margin-bottom: 20px;
  ${({ active }) =>
    active &&
    `
    border-color: #8E8E93;
    border-width: 2px;`}
`;

const Title = styled.div`
  font-weight: bold;
  color: #8e8e93;
`;

const Body = styled.div`
  padding: 10px;
`;
