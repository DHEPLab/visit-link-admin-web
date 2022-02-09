import React, { useState } from "react";
import styled from "styled-components";

import { FieldArray } from "formik";
import { Space, Button, message } from "antd";

import Factory from "./factory";
import { ComponentQuestion } from "./*";
import { Iconfont, Card } from "../*";

export function handleMoveUp(helpers, index, focus, setFocus) {
  if (index === 0) return;
  helpers.move(index, index - 1);
  if (focus === index) {
    setFocus(index - 1);
  }
}

export function handleMoveDown(helpers, index, focus, setFocus, componentSize) {
  if (index === componentSize - 1) return;
  helpers.move(index, index + 1);
  if (focus === index) {
    setFocus(index + 1);
  }
}

export function handleRemove(helpers, index, focus, setFocus) {
  helpers.remove(index);
  if (focus === index) {
    setFocus(-1);
  }
  if (focus > index) {
    setFocus(focus - 1);
  }
}

export function insertComponent(length, helpers, component, focus, setFocus) {
  if (length > 20) {
    message.warning("题目数量最多添加二十个！")
    return
  }
  if (focus === -1) {
    helpers.push(component);
  } else {
    helpers.insert(focus + 1, component);
    setFocus(focus + 1);
  }
}

export default function SurveyComponents({ value, readonly, stickyTop }) {
  const [focus, setFocus] = useState(-1);
  return (
    <FieldArray name="questions">
      {(helpers) => {
        return (
          <FieldArrayContainer>
            <ComponentForm>
              {value && value.map((component, index) => (
                <ComponentQuestion
                  {...{ index, readonly, component, focus: focus === index, key: component.key }}
                  name="questions"
                  onRemove={() => handleRemove(helpers, index, focus, setFocus)}
                  onMoveUp={() => handleMoveUp(helpers, index, focus, setFocus)}
                  onMoveDown={() => handleMoveDown(helpers, index, focus, setFocus, value.length)}
                  onFocus={() => setFocus(index)}
                />
              ))}
            </ComponentForm>

            {!readonly && (
              <ComponentToolBar>
                <StickyContainer top={stickyTop}>
                  <Card title="添加组件：">
                    <Space direction="vertical" size="large">
                      <Button
                        type="primary"
                        onClick={() => insertComponent(value.length, helpers, Factory.createQuestionText(), focus, setFocus)}
                      >
                        <Iconfont type="iconquestion-text" /> 添加文本问题
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => insertComponent(value.length, helpers, Factory.createQuestionRadio(), focus, setFocus)}
                      >
                        <Iconfont type="iconquestion-radio" />
                        添加单选问题
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => insertComponent(value.length, helpers, Factory.createQuestionCheckbox(), focus, setFocus)}
                      >
                        <Iconfont type="iconquestion-checkbox" />
                        添加多选问题
                      </Button>
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
