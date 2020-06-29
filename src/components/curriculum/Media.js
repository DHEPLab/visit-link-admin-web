import React from 'react';
import Container from './Container';

export default function Media({ name, value, onChange, onRemove }) {
  const type = `${name}.type`;
  const file = `${name}.file`;
  const alt = `${name}.alt`;

  return (
    <Container title="媒体组件" onRemove={onRemove}>
      <input name={type} value={value.type} onChange={onChange} placeholder="Type" />
      <input name={file} value={value.file} onChange={onChange} placeholder="File" />
      <input name={alt} value={value.alt} onChange={onChange} placeholder="Alt" />
    </Container>
  );
}
