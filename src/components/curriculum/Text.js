import React from 'react';
import styled from 'styled-components';

export default function Text({ value }) {
  return <Container>{value}</Container>;
}

const Container = styled.div`
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px 20px;
  margin-bottom: 10px;
`;
