import React from 'react';
import { Button } from 'antd';
import { FieldArray } from 'formik';

import Factory from './factory';
import { Container, ComponentField } from './*';

export default function Case({ name, value, index, onChange, ...props }) {
  const Name = {
    text: `${name}.text`,
    finishAction: `${name}.finishAction`,
    components: `${name}.components`,
  };

  return (
    <Container title={`选项 ${index + 1}`} name={name} hideMove {...props}>
      <input name={Name.text} value={value.text} onChange={onChange} placeholder="Case Text" />
      <input
        name={Name.finishAction}
        value={value.finishAction}
        onChange={onChange}
        placeholder="Finish Action"
      />
      <FieldArray name={Name.components}>
        {(helpers) => {
          function handleMoveUp(index) {
            if (index === 0) return;
            helpers.move(index, index - 1);
          }

          function handleMoveDown(index) {
            if (index === value.components.length - 1) return;
            helpers.move(index, index + 1);
          }

          return (
            <>
              <div>
                <Button type="link" onClick={() => helpers.push(Factory.createText())}>
                  添加文本组件
                </Button>
                <Button type="link" onClick={() => helpers.push(Factory.createMedia())}>
                  添加媒体组件
                </Button>
                <Button type="link" onClick={() => helpers.push(Factory.createSwitch())}>
                  添加选择组件
                </Button>
              </div>
              {value.components.map((component, index) => (
                <ComponentField
                  {...props}
                  index={index}
                  key={component.key}
                  name={Name.components}
                  component={component}
                  onRemove={() => helpers.remove(index)}
                  onMoveUp={() => handleMoveUp(index)}
                  onMoveDown={() => handleMoveDown(index)}
                />
              ))}
            </>
          );
        }}
      </FieldArray>
    </Container>
  );
}
