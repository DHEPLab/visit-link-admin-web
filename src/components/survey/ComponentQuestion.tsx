import React from "react";
import { Field } from "formik";
import QuestionText from "./QuestionText";
import QuestionRadio from "./QuestionRadio";
import { SurveyComponentType } from "@/models/res/Survey";

type ComponentQuestionProps = {
  name: string;
  component: SurveyComponentType;
  index: number;
  readonly: boolean;
  focus: boolean;
  onRemove: VoidFunction;
  onMoveUp: VoidFunction;
  onMoveDown: VoidFunction;
  onFocus: VoidFunction;
};

const ComponentMap: { [key: string]: React.ElementType } = {
  Text: QuestionText,
  Radio: QuestionRadio,
  Checkbox: QuestionRadio,
};

const ComponentQuestion: React.FC<ComponentQuestionProps> = (props) => {
  const { name, component, index, readonly, focus, onRemove, onMoveUp, onMoveDown, onFocus } = props;

  const As = ComponentMap[component.type];

  const handleMoveDown = () => {
    onMoveDown();
    setTimeout(() => {
      document.getElementById(`${name}.${index + 1}`)?.scrollIntoView();
    }, 200);
  };

  return (
    <div id={`${name}.${index}`}>
      <Field
        name={`${name}.${index}.value`}
        index={index}
        readonly={readonly}
        focus={focus}
        onFocus={onFocus}
        onRemove={onRemove}
        onMoveUp={onMoveUp}
        onMoveDown={handleMoveDown}
        as={As}
      />
    </div>
  );
};

export default ComponentQuestion;
