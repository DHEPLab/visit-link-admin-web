import React from 'react';
import styled from 'styled-components';

export default function ({ label, children }) {
  return (
    <StaticField>
      <Label>{label}</Label>
      <Value>{children}</Value>
    </StaticField>
  );
}

const StaticField = styled.div`
  display: flex;
  margin-bottom: 24px;
`;

const Label = styled.div`
  width: 100px;
  text-align: right;
  margin-right: 30px;
  font-size: 16px;
  color: #8e8e93;
`;

const Value = styled.div`
  color: #000;
  font-weight: bold;
`;
