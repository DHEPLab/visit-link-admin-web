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
  const nameHtml = `${name}.html`;
  const valueHtml = value.html;
  const nameType = `${name}.type`;
  const valueType = value.type;
  return (
    <Container>
      <input name={nameType} value={valueType} onChange={onChange} onBlur={onBlur} />
      <Quill theme="snow" modules={{ toolbar }} value={valueHtml} onChange={onChange(nameHtml)} />
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px 20px;
  margin-bottom: 10px;
`;
