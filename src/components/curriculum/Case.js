import React, { useState } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { Button, Cascader } from 'antd';
import { FieldArray } from 'formik';

import Factory from './factory';
import { Container, ComponentField } from './*';
import { GhostInput } from '../*';

export default function Case({ name, value, index, onChange, ...props }) {
  const [options, setOptions] = useState([]);

  const Name = {
    text: `${name}.text`,
    finishAction: `${name}.finishAction`,
    components: `${name}.components`,
  };

  function onChangeCascader(finishAction) {
    onChange(Name.finishAction)({ target: { value: finishAction } });
  }

  function onPopupVisibleChange(visible) {
    if (visible) {
      Axios.get('/admin/modules', {
        params: {
          size: 1000,
          published: true,
        },
      }).then(({ data }) => {
        const modules = data.content.map((module) => ({
          label: `${module.number} ${module.name}`,
          value: module.id,
        }));

        setOptions([
          {
            label: '结束选项继续本层级内容',
            value: 'Continue',
          },
          {
            label: '跳转至其他模块并结束本内容模块',
            value: 'Redirect_End',
            children: modules,
          },
          {
            label: '跳转至其他模块并继续本层级内容',
            value: 'Redirect_Continue',
            children: modules,
          },
        ]);
      });
    }
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
          options={options}
          onChange={onChangeCascader}
          onPopupVisibleChange={onPopupVisibleChange}
          size="small"
          placeholder="请选择选项结束跳转至"
        />
      }
    >
      <GhostInputContainer>
        <GhostInput
          disabled={props.readonly}
          name={Name.text}
          value={value.text}
          onChange={onChange}
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
                  <Button type="link" onClick={() => helpers.push(Factory.createSwitch())}>
                    添加选择
                  </Button>
                  <Button type="link" onClick={() => helpers.push(Factory.createPageFooter())}>
                    添加翻页分割组件
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
