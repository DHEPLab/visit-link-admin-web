import React from 'react';
import { Button } from 'antd';
import { FieldArray } from 'formik';
import styled from 'styled-components';

import Factory from './factory';
import { Text, Container, Case } from './*';

export default function Switch({ name, value, onChange, ...props }) {
  const Name = {
    question: `${name}.question`,
    cases: `${name}.cases`,
    case: (index) => `${name}.cases.${index}`,
  };

  return (
    <Container icon="iconswitch-gray" title="选择组件" name={name} {...props}>
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
            {!props.readonly && (
              <ButtonContainer>
                <Button size="mini" type="link" onClick={() => helpers.push(Factory.createCase())}>
                  添加选项
                </Button>
              </ButtonContainer>
            )}
          </>
        )}
      </FieldArray>
      {/* <pre>{JSON.stringify(value, null, 2)}</pre> */}
    </Container>
  );
}

const ButtonContainer = styled.div`
  height: 40px;
  width: 100%;
  border-radius: 8px;
  background: rgba(255, 195, 160, 0.1);
  border: 1px solid rgba(255, 195, 160, 1);
  text-align: center;
  margin-bottom: 20px;
`;
