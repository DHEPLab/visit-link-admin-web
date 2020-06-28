import React from 'react';
import Quill from 'react-quill';
import styled from 'styled-components';

export default function Text({ value, setValue }) {
  return (
    <Container>
      <Quill theme="snow" value={value} onChange={setValue} />
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px 20px;
  margin-bottom: 10px;
`;
