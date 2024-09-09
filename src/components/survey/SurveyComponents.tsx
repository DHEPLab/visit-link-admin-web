import React, { useState } from "react";
import styled from "styled-components";

import { FieldArray } from "formik";

import SurveyFactory from "./surveyFactory";
import { useTranslation } from "react-i18next";
import ComponentQuestion from "./ComponentQuestion";
import { handleMoveDown, handleMoveUp, handleRemove, insertComponent } from "@/components/utils/fieldArrayUtils";
import { SurveyComponentType } from "@/models/res/Survey";
import QuestionOperationBar from "@/components/survey/QuestionOperationBar";

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
              <QuestionOperationBar
                stickyTop={stickyTop}
                onAddTextQuestion={() =>
                  insertComponent(
                    helpers,
                    SurveyFactory.createQuestionText(),
                    focus,
                    setFocus,
                    questions.length,
                    t("maxQuestions"),
                  )
                }
                onAddRadioQuestion={() =>
                  insertComponent(
                    helpers,
                    SurveyFactory.createQuestionRadio(),
                    focus,
                    setFocus,
                    questions.length,
                    t("maxQuestions"),
                  )
                }
                onAddCheckboxQuestion={() =>
                  insertComponent(
                    helpers,
                    SurveyFactory.createQuestionCheckbox(),
                    focus,
                    setFocus,
                    questions.length,
                    t("maxQuestions"),
                  )
                }
              />
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

export default SurveyComponents;
