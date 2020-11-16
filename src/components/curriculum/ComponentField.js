import React from "react";
import { FastField } from "formik";

import { Text, Media, Switch, PageFooter } from "./*";

export default function ComponentField({ name, component, index, onMoveDown, ...props }) {
  let As;
  switch (component.type) {
    case "Text":
      As = Text;
      break;
    case "Media":
      As = Media;
      break;
    case "Switch":
      As = Switch;
      break;
    case "PageFooter":
      As = PageFooter;
      break;
    default:
      As = <div>{component.type}</div>;
  }

  // as can either be a React component or the name of an HTML element to render.
  // Formik will automagically inject onChange, onBlur, name, and value props of the field designated by the name prop to the (custom) component.
  return (
    <div id={`${name}.${index}`}>
      <FastField
        name={`${name}.${index}.value`}
        onMoveDown={() => {
          onMoveDown();
          // Scroll to follow when moving components down.
          // When moving up it is auto-followed and not processed, possibly due to React re-rendering? I don't know.
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
