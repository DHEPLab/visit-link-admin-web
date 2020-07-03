import React from 'react';
import { Button } from 'antd';
import { FieldArray } from 'formik';

import Factory from './factory';
import { Text, Container, Case } from './*';

export default function Switch({ name, value, onRemove, onChange }) {
  const Name = {
    question: `${name}.question`,
    cases: `${name}.cases`,
    case: (index) => `${name}.cases.${index}`,
  };

  return (
    <Container title="选择组件" onRemove={onRemove}>
      <Text name={Name.question} value={value.question} onChange={onChange} />
      <FieldArray name={Name.cases}>
        {(helpers) => (
          <>
            <Button size="mini" type="link" onClick={() => helpers.push(Factory.createCase())}>
              添加选项
            </Button>
            {value.cases.map((c, index) => (
              <Case
                key={c.key}
                index={index}
                name={Name.case(index)}
                onRemove={() => helpers.remove(index)}
                value={c}
                onChange={onChange}
              />
            ))}
          </>
        )}
      </FieldArray>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </Container>
  );
}
