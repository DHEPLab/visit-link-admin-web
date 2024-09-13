import { Field } from "formik";
import React from "react";

type FieldArrayComponentProps<T> = {
  name: string;
  component: T;
  index: number;
  readonly: boolean;
  focus: boolean;
  onRemove: VoidFunction;
  onMoveUp: VoidFunction;
  onMoveDown: VoidFunction;
  onFocus: VoidFunction;
  componentMap: { [key: string]: React.ElementType };
};

const FieldArrayComponent = <T extends { type: string }>(props: FieldArrayComponentProps<T>) => {
  const { name, component, index, readonly, focus, onRemove, onMoveUp, onMoveDown, onFocus, componentMap } = props;
  const As = componentMap[component.type];

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
        key={`${name}.${index}.value`}
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

export default FieldArrayComponent;
