import React from 'react';
import styled from 'styled-components';

export default function ({ label, children }) {
  return (
    <Container>
      <Label>{label}</Label>
      <Value>{children}</Value>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  & + & {
    margin-top: 20px;
  }
`;

const Label = styled.div`
  width: 100px;
  text-align: right;
  margin-right: 30px;
  font-size: 16px;
  color: #8e8e93;
`;

const Value = styled.div`
  color: #4a4a4a;
  font-weight: bold;
`;
