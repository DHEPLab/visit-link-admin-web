import React from 'react';
import { Button } from 'antd';
import { FieldArray } from 'formik';

import Factory from './factory';
import { Text, Container, Case } from './*';

export default function Switch({ name, value, onChange, ...props }) {
  const Name = {
    question: `${name}.question`,
    cases: `${name}.cases`,
    case: (index) => `${name}.cases.${index}`,
  };

  return (
    <Container title="选择组件" name={name} {...props}>
      <Text
        {...props}
        name={Name.question}
        value={value.question}
        onChange={onChange}
        hideMove
        hideRemove
      />
      <FieldArray name={Name.cases}>
        {(helpers) => (
          <>
            <Button size="mini" type="link" onClick={() => helpers.push(Factory.createCase())}>
              添加选项
            </Button>
            {value.cases.map((v, index) => (
              <Case
                {...props}
                key={v.key}
                value={v}
                index={index}
                name={Name.case(index)}
                onRemove={() => helpers.remove(index)}
                onChange={onChange}
              />
            ))}
          </>
        )}
      </FieldArray>
      {/* <pre>{JSON.stringify(value, null, 2)}</pre> */}
    </Container>
  );
}
