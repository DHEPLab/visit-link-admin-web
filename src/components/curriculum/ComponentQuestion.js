import React from "react";
import { Field } from "formik";
import { QuestionText } from "./*";

export default function ComponentQuestion({ name, component, index, onMoveDown, ...props }) {
  let As;
  switch (component.type) {
    case "Text":
      As = QuestionText;
      break;
    case "Media":
      As = QuestionText;
      break;
    case "Switch":
      As = QuestionText;
      break;
    default:
      As = <div>{component.type}</div>;
  }

  return (
    <div id={`${name}.${index}`}>
      <Field
        name={`${name}.${index}.value`}
        onMoveDown={() => {
          onMoveDown();
          setTimeout(() => {
            const next = document.getElementById(`${name}.${index + 1}`);
            next && next.scrollIntoView();
          }, 200);
        }}
        {...props}
        as={As}
      />
    </div>
  );
}
