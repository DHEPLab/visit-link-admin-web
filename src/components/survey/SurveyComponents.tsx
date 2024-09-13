import FieldArrayComponent from "@/components/FieldArrayComponent";
import QuestionOperationBar from "./QuestionOperationBar";
import { QuestionMultipleChoice, QuestionSingleChoice } from "./QuestionChoice";
import QuestionText from "./QuestionText";
import { handleMoveDown, handleMoveUp, handleRemove, insertComponent } from "@/components/utils/fieldArrayUtils";
import { SurveyComponentType } from "@/models/res/Survey";

import { FieldArray } from "formik";
import { ArrayHelpers } from "formik/dist/FieldArray";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import SurveyFactory from "./surveyFactory";

type SurveyComponentsProps = {
  questions: SurveyComponentType[];
  readonly: boolean;
  stickyTop: number;
};

const ComponentMap: { [key: string]: React.ElementType } = {
  Text: QuestionText,
  Radio: QuestionSingleChoice,
  Checkbox: QuestionMultipleChoice,
};

const SurveyComponents: React.FC<SurveyComponentsProps> = ({ questions = [], readonly, stickyTop }) => {
  const [focus, setFocus] = useState(-1);
  const { t } = useTranslation("surveyComponents");

  const addQuestion = (helpers: ArrayHelpers<SurveyComponentType[]>, question: SurveyComponentType) => {
    insertComponent(helpers, question, focus, setFocus, questions.length, t("maxQuestions"));
  };

  return (
    <FieldArray name="questions">
      {(helpers) => {
        return (
          <FieldArrayContainer>
            <ComponentForm>
              {questions.map((question, index) => (
                <FieldArrayComponent
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
                  componentMap={ComponentMap}
                />
              ))}
            </ComponentForm>

            {!readonly && (
              <QuestionOperationBar
                stickyTop={stickyTop}
                onAddTextQuestion={() => addQuestion(helpers, SurveyFactory.createQuestionText())}
                onAddRadioQuestion={() => addQuestion(helpers, SurveyFactory.createQuestionRadio())}
                onAddCheckboxQuestion={() => addQuestion(helpers, SurveyFactory.createQuestionCheckbox())}
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
