import React from "react";
import { Field } from "formik";
import QuestionText from "./QuestionText";
import QuestionRadio from "./QuestionRadio";
import { SurveyComponentType } from "@/models/res/Survey";

type ComponentQuestionProps = {
  name: string;
  component: SurveyComponentType;
  index: number;
  onMoveDown: () => void;
};

const ComponentQuestion: React.FC<ComponentQuestionProps> = ({ name, component, index, onMoveDown, ...props }) => {
  let As;
  switch (component.type) {
    case "Text":
      As = QuestionText;
      break;
    case "Radio":
      As = QuestionRadio;
      break;
    case "Checkbox":
      As = QuestionRadio;
      break;
  }

  return (
    <div id={`${name}.${index}`}>
      <Field
        name={`${name}.${index}.value`}
        index={index}
        onMoveDown={() => {
          onMoveDown();
          setTimeout(() => {
            document.getElementById(`${name}.${index + 1}`)?.scrollIntoView();
          }, 200);
        }}
        {...props}
        as={As}
      />
    </div>
  );
};

export default ComponentQuestion;
