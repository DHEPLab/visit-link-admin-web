import React from 'react';
import styled from 'styled-components';

export default function Container({ title, children }) {
  return (
    <StyledContainer>
      <Title>{title}</Title>
      <Body>{children}</Body>
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  border: 1px solid #eee;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const Title = styled.div`
  border-bottom: 1px solid #eee;
  padding: 12px 30px;
  font-weight: bold;
  color: #8e8e93;
`;

const Body = styled.div`
  padding: 10px;
`;
