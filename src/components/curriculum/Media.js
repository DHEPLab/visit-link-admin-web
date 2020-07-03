import React from 'react';
import Container from './Container';

export default function Media({ name, value, onChange, onRemove }) {
  const Name = {
    type: `${name}.type`,
    file: `${name}.file`,
    text: `${name}.text`,
  };

  return (
    <Container title="媒体组件" onRemove={onRemove}>
      <input name={Name.type} value={value.type} onChange={onChange} placeholder="Media Type" />
      <input name={Name.file} value={value.file} onChange={onChange} placeholder="Media File" />
      <input name={Name.text} value={value.text} onChange={onChange} placeholder="Media Text" />
    </Container>
  );
}
