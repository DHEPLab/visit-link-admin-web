import React from 'react';
import Quill from 'react-quill';

import Container from './Container';

const toolbar = [['bold', 'italic'], [{ list: 'ordered' }]];

export default function Text({ name, onBlur, onChange, value, index, onRemove }) {
  const html = `${name}.html`;
  const type = `${name}.type`;

  return (
    <Container title="文本组件" onRemove={() => onRemove(index)}>
      <input
        placeholder="Type"
        name={type}
        value={value.type}
        onChange={onChange}
        onBlur={onBlur}
      />
      <Quill theme="snow" modules={{ toolbar }} value={value.html} onChange={onChange(html)} />
    </Container>
  );
}
