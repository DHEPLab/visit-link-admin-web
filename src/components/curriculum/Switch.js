import React from 'react';

import { Text, Container, Case } from './*';

export default function Switch({ name, value, onRemove, onChange }) {
  const Name = {
    question: `${name}.question`,
    case: (index) => `${name}.cases.${index}`,
  };

  return (
    <Container title="选择组件" onRemove={onRemove}>
      <Text name={Name.question} value={value.question} onChange={onChange} />
      {value.cases.map((c, index) => (
        <Case key={c.key} name={Name.case(index)} value={c} onChange={onChange} />
      ))}
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </Container>
  );
}
