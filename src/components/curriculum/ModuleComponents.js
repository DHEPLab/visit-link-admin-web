import React, { useState } from "react";
import styled from "styled-components";

import { FieldArray } from "formik";
import { Space, Button } from "antd";

import Factory from "./factory";
import { ComponentField } from "./*";
import { Iconfont, Card } from "../*";

export default function ModuleComponents({ value, readonly, stickyTop }) {
  // current focus component index (first layer)
  const [focus, setFocus] = useState(-1);

  return (
    <FieldArray name="components">
      {(helpers) => {
        function handleMoveUp(index) {
          if (index === 0) return;
          helpers.move(index, index - 1);
        }

        function handleMoveDown(index) {
          if (index === value.length - 1) return;
          helpers.move(index, index + 1);
        }

        return (
          <FieldArrayContainer>
            <ComponentForm>
              {value.map((component, index) => (
                <ComponentField
                  {...{ index, readonly, component, focus: focus === index, key: component.key }}
                  name="components"
                  onRemove={() => helpers.remove(index)}
                  onMoveUp={() => handleMoveUp(index)}
                  onMoveDown={() => handleMoveDown(index)}
                  onFocus={() => setFocus(index)}
                />
              ))}
            </ComponentForm>

            {!readonly && (
              <ComponentToolBar>
                <StickyContainer top={stickyTop}>
                  <Card title="添加组件：">
                    <Space direction="vertical" size="large">
                      <Button type="primary" onClick={() => helpers.push(Factory.createText())}>
                        <Iconfont type="icontext" /> 添加文本组件
                      </Button>
                      <Button type="primary" onClick={() => helpers.push(Factory.createMedia())}>
                        <Iconfont type="iconmedia" />
                        添加媒体组件
                      </Button>
                      <Button type="primary" onClick={() => helpers.push(Factory.createSwitch())}>
                        <Iconfont type="iconswitch" />
                        添加选择组件
                      </Button>
                      <PageButton type="primary" onClick={() => helpers.push(Factory.createPageFooter())}>
                        添加翻页分割组件
                      </PageButton>
                    </Space>
                  </Card>
                </StickyContainer>
              </ComponentToolBar>
            )}
          </FieldArrayContainer>
        );
      }}
    </FieldArray>
  );
}

const PageButton = styled(Button)`
  width: 182px;
`;

const FieldArrayContainer = styled.div`
  display: flex;
`;

const ComponentForm = styled.div`
  flex: 1;
`;

const ComponentToolBar = styled.div``;

const StickyContainer = styled.div`
  position: relative;
  top: ${({ top }) => top}px;
  height: 360px;
  margin-left: 40px;
  box-shadow: 0px 4px 12px 0px rgba(255, 148, 114, 0.3);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
`;
