import React from 'react';
import styled from 'styled-components';

export default function UploadButton({ title, children }) {
  return (
    <Container>
      <Title>{title}</Title>
      <Placeholder>{children}</Placeholder>
    </Container>
  );
}

const Container = styled.div`
  width: 188px;
  height: 200px;
  background: #fff9f5;
  border: 1px solid #ffc3a0;
  border-radius: 8px;
  margin: 0 15px;
  cursor: pointer;
  text-align: center;
`;

const Title = styled.div`
  padding-top: 10px;
  color: #ff794f;
  font-weight: bold;
`;

const Placeholder = styled.div`
  padding-top: 10px;
  color: #8e8e93;
  font-size: 12px;
  margin: 0 auto;
`;
