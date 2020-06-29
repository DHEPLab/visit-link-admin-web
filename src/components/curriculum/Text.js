import React from 'react';
import Quill from 'react-quill';
import styled from 'styled-components';

const toolbar = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline'], // toggled buttons
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
];

export default function Text({ name, onBlur, onChange, value }) {
  return (
    <Container>
      <Quill
        theme="snow"
        modules={{ toolbar }}
        onBlur={onBlur}
        value={value}
        onChange={onChange(name)}
      />
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px 20px;
  margin-bottom: 10px;
`;
