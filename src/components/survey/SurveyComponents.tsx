import React, { useState } from "react";
import styled from "styled-components";

import { FieldArray } from "formik";
import { Space, Button } from "antd";

import SurveyFactory from "./surveyFactory";
import Iconfont from "../Iconfont";
import Card from "../Card";
import { useTranslation } from "react-i18next";
import ComponentQuestion from "./ComponentQuestion";
import { handleMoveDown, handleMoveUp, handleRemove, insertComponent } from "@/components/utils/fieldArrayUtils";
import isPropValid from "@emotion/is-prop-valid";
import { SurveyComponentType } from "@/models/res/Survey";

type SurveyComponentsProps = {
  questions: SurveyComponentType[];
  readonly: boolean;
  stickyTop: number;
};

const SurveyComponents: React.FC<SurveyComponentsProps> = ({ questions, readonly, stickyTop }) => {
  const [focus, setFocus] = useState(-1);
  const { t } = useTranslation("surveyComponents");

  return (
    <FieldArray name="questions">
      {(helpers) => {
        return (
          <FieldArrayContainer>
            <ComponentForm>
              {questions &&
                questions.map((question, index) => (
                  <ComponentQuestion
                    key={question.key}
                    index={index}
                    readonly={readonly}
                    component={question}
                    focus={focus === index}
                    name="questions"
                    onRemove={() => handleRemove(helpers, index, focus, setFocus)}
                    onMoveUp={() => handleMoveUp(helpers, index, focus, setFocus)}
                    onMoveDown={() => handleMoveDown(helpers, index, focus, setFocus, questions.length)}
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
                            helpers,
                            SurveyFactory.createQuestionText(),
                            focus,
                            setFocus,
                            questions.length,
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
                            helpers,
                            SurveyFactory.createQuestionRadio(),
                            focus,
                            setFocus,
                            questions.length,
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
                            helpers,
                            SurveyFactory.createQuestionCheckbox(),
                            focus,
                            setFocus,
                            questions.length,
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
};

const FieldArrayContainer = styled.div`
  display: flex;
`;

const ComponentForm = styled.div`
  flex: 1;
`;

const ComponentToolBar = styled.div``;

const StickyContainer = styled("div").withConfig({
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== "top",
})<{ top: number }>`
  position: relative;
  top: ${({ top }) => top}px;
  height: 360px;
  margin-left: 40px;
  box-shadow: 0 4px 12px 0 rgba(255, 148, 114, 0.3);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
`;

export default SurveyComponents;
