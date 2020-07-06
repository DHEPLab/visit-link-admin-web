import React from 'react';
import { FieldArray } from 'formik';

import { Container, ComponentField } from './*';

export default function Case({ name, value, index, onChange, ...props }) {
  const Name = {
    text: `${name}.text`,
    finishAction: `${name}.finishAction`,
    components: `${name}.components`,
  };

  return (
    <Container title={`选项 ${index + 1}`} name={name} {...props}>
      <input name={Name.text} value={value.text} onChange={onChange} placeholder="Case Text" />
      <input
        name={Name.finishAction}
        value={value.finishAction}
        onChange={onChange}
        placeholder="Finish Action"
      />
      <FieldArray name={Name.components}>
        {(helpers) => {
          return (
            <>
              {value.components.map((component, index) => (
                <ComponentField
                  {...props}
                  key={component.key}
                  name={Name.components}
                  index={index}
                  component={component}
                />
              ))}
            </>
          );
        }}
      </FieldArray>
    </Container>
  );
}
