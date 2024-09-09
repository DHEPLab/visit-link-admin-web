import React, { useState } from "react";
import styled from "styled-components";

import { FieldArray } from "formik";
import { Space, Button, message } from "antd";

import SurveyFactory from "./surveyFactory";
import Iconfont from "../Iconfont";
import Card from "../Card";
import { useTranslation } from "react-i18next";
import ComponentQuestion from "./ComponentQuestion";

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

export function insertComponent(length, helpers, component, focus, setFocus, warningText) {
  if (length > 20) {
    message.warning(warningText);
    return;
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
  const { t } = useTranslation("surveyComponents");

  return (
    <FieldArray name="questions">
      {(helpers) => {
        return (
          <FieldArrayContainer>
            <ComponentForm>
              {value &&
                value.map((component, index) => (
                  <ComponentQuestion
                    key={component.key}
                    {...{ index, readonly, component, focus: focus === index }}
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
                  <Card title={t("addComponent")}>
                    <Space direction="vertical" size="large">
                      <Button
                        type="primary"
                        onClick={() =>
                          insertComponent(
                            value.length,
                            helpers,
                            SurveyFactory.createQuestionText(),
                            focus,
                            setFocus,
                            t("maxQuestions"),
                          )
                        }
                      >
                        <Iconfont type="iconquestion-text" /> {t("addTextQuestion")}
                      </Button>
                      <Button
                        type="primary"
                        onClick={() =>
                          insertComponent(
                            value.length,
                            helpers,
                            SurveyFactory.createQuestionRadio(),
                            focus,
                            setFocus,
                            t("maxQuestions"),
                          )
                        }
                      >
                        <Iconfont type="iconquestion-radio" /> {t("addSingleChoiceQuestion")}
                      </Button>
                      <Button
                        type="primary"
                        onClick={() =>
                          insertComponent(
                            value.length,
                            helpers,
                            SurveyFactory.createQuestionCheckbox(),
                            focus,
                            setFocus,
                            t("maxQuestions"),
                          )
                        }
                      >
                        <Iconfont type="iconquestion-checkbox" /> {t("addMultipleChoiceQuestion")}
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
