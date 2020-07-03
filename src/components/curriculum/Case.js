import React from 'react';

import { Container, ComponentField } from './*';

export default function Case({ name, value, index, onChange, onRemove }) {
  const Name = {
    text: `${name}.text`,
    finishAction: `${name}.finishAction`,
    components: `${name}.components`,
  };

  return (
    <Container title={`选项 ${index + 1}`} onRemove={onRemove}>
      <input name={Name.text} value={value.text} onChange={onChange} placeholder="Case Text" />
      <input
        name={Name.finishAction}
        value={value.finishAction}
        onChange={onChange}
        placeholder="Finish Action"
      />
      {value.components.map((component, index) => (
        <ComponentField
          key={component.key}
          name={Name.components}
          index={index}
          component={component}
        />
      ))}
    </Container>
  );
}
