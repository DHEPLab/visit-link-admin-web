import React from 'react';
import Quill from 'react-quill';

import Container from './Container';

const toolbar = [['bold', 'italic'], [{ list: 'ordered' }]];

export default function Text({ name, onBlur, onChange, value, onRemove }) {
  const Name = {
    html: `${name}.html`,
    type: `${name}.type`,
  };

  return (
    <Container title="文本组件" onRemove={onRemove}>
      <input
        placeholder="Type"
        name={Name.type}
        value={value.type}
        onChange={onChange}
        onBlur={onBlur}
      />
      <Quill theme="snow" modules={{ toolbar }} value={value.html} onChange={onChange(Name.html)} />
    </Container>
  );
}
