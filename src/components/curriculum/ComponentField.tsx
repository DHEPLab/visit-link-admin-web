import { ModuleComponentType } from "@/models/res/Moduel";
import React from "react";
import { Field } from "formik";
import Text from "./Text";
import Media from "./Media";
import Switch from "./Switch";
import PageFooter from "./PageFooter";

type ComponentFieldProps = {
  name: string;
  component: ModuleComponentType;
  index: number;
  readonly: boolean;
  focus: boolean;
  onRemove: VoidFunction;
  onMoveUp: VoidFunction;
  onMoveDown: VoidFunction;
  onFocus: VoidFunction;
};

const ComponentMap: { [key: string]: React.ElementType } = {
  Text: Text,
  Media: Media,
  Switch: Switch,
  PageFooter: PageFooter,
};

const ComponentField: React.FC<ComponentFieldProps> = (props) => {
  const { name, component, index, readonly, focus, onRemove, onMoveUp, onMoveDown, onFocus } = props;
  const As = ComponentMap[component.type];

  const handleMoveDown = () => {
    onMoveDown();
    setTimeout(() => {
      document.getElementById(`${name}.${index + 1}`)?.scrollIntoView();
    }, 200);
  };

  // as can either be a React component or the name of an HTML element to render.
  // Formik will automagically inject onChange, onBlur, name, and value props of the field designated by the name prop to the (custom) component.
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

export default ComponentField;
