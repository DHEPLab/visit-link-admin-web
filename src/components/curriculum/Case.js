import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Button, Cascader, message } from 'antd';
import { FieldArray } from 'formik';

import Factory from './factory';
import { Container, ComponentField } from './*';
import { GhostInput } from '../*';

export default function Case({ name, value, index, onChange, ...props }) {
  // temporarily stores the text value，modify the formik value on blur event to improve performance
  const [text, setText] = useState(value.text);
  const modules = useSelector((state) => state.modules);

  const Name = {
    text: `${name}.text`,
    finishAction: `${name}.finishAction`,
    components: `${name}.components`,
  };

  function onChangeCascader(finishAction) {
    onChange(Name.finishAction)({ target: { value: finishAction } });
  }

  return (
    <Container
      {...props}
      title={`选项 ${index + 1}`}
      name={name}
      hideMove
      extra={
        <StyledCascader
          allowClear={false}
          disabled={props.readonly}
          options={modules}
          value={value.finishAction}
          onChange={onChangeCascader}
          size="small"
          placeholder="请选择选项结束跳转至"
        />
      }
    >
      <GhostInputContainer>
        <GhostInput
          disabled={props.readonly}
          name={Name.text}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => onChange(Name.text)(text)}
          placeholder="请输入选项文本，限20个字符"
        />
      </GhostInputContainer>
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

          function handleAddSwitch() {
            if (name.split('.cases').length > 2) {
              message.warn('选项组件嵌套层级最多为3级');
              return;
            }
            helpers.push(Factory.createSwitch());
          }

          return (
            <>
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
              {!props.readonly && (
                <div>
                  <Button type="link" onClick={() => helpers.push(Factory.createText())}>
                    添加文本
                  </Button>
                  <Button type="link" onClick={() => helpers.push(Factory.createMedia())}>
                    添加媒体
                  </Button>
                  <Button type="link" onClick={handleAddSwitch}>
                    添加选择
                  </Button>
                </div>
              )}
            </>
          );
        }}
      </FieldArray>
    </Container>
  );
}

const StyledCascader = styled(Cascader)`
  .ant-input {
    border-radius: 8px;
  }
`;

const GhostInputContainer = styled.div`
  padding: 20px;
`;
