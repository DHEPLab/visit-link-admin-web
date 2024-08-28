import React from "react";
import { Field } from "formik";
import QuestionText from "./QuestionText";
import QuestionRadio from "./QuestionRadio";

export default function ComponentQuestion({ name, component, index, onMoveDown, ...props }) {
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
    default:
      As = <div>{component.type}</div>;
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
}
