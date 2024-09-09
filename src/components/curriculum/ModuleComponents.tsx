import React, { useState } from "react";
import styled from "styled-components";

import { FieldArray } from "formik";
import ComponentField from "./ComponentField";
import { handleMoveDown, handleMoveUp, handleRemove } from "@/components/utils/fieldArrayUtils";
import ToolBar from "./ToolBar";
import { ModuleComponentType } from "@/models/res/Moduel";

type ModuleComponentsProps = {
  value: ModuleComponentType[];
  readonly: boolean;
};

const ModuleComponents: React.FC<ModuleComponentsProps> = ({ value, readonly }) => {
  const [focus, setFocus] = useState(-1);

  return (
    <FieldArray name="components">
      {(helpers) => {
        return (
          <FieldArrayContainer>
            <ComponentForm>
              {value.map((component, index) => (
                <ComponentField
                  name="components"
                  key={component.key}
                  index={index}
                  readonly={readonly}
                  component={component}
                  focus={focus === index}
                  onRemove={() => handleRemove(helpers, index, focus, setFocus)}
                  onMoveUp={() => handleMoveUp(helpers, index, focus, setFocus)}
                  onMoveDown={() => handleMoveDown(helpers, index, focus, setFocus, value.length)}
                  onFocus={() => setFocus(index)}
                />
              ))}
            </ComponentForm>
            <ToolBar readonly={readonly} helpers={helpers} focus={focus} setFocus={setFocus} />
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

export default ModuleComponents;
