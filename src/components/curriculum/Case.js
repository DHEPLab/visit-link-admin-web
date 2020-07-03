import React from 'react';

import { Container, ComponentField } from './*';

export default function Case({ name, value, onChange }) {
  const Name = {
    text: `${name}.text`,
    components: `${name}.components`,
  };

  return (
    <Container title="选项">
      <input name={Name.text} value={value.text} onChange={onChange} placeholder="Case Text" />
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
