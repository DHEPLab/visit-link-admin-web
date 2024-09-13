import { ModuleComponentMap } from "./constants";
import FieldArrayComponent from "@/components/FieldArrayComponent";
import { handleMoveDown, handleMoveUp, handleRemove } from "@/components/utils/fieldArrayUtils";
import { ModuleComponentType } from "@/models/res/Moduel";

import { FieldArray } from "formik";
import React, { useState } from "react";
import styled from "styled-components";
import ToolBar from "./ToolBar";

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
                <FieldArrayComponent
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
                  componentMap={ModuleComponentMap}
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
