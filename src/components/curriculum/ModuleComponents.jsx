import React, { useState } from "react";
import styled from "styled-components";

import { FieldArray } from "formik";
import ComponentField from "./ComponentField";
import { handleMoveDown, handleMoveUp, handleRemove } from "./utils/moduleComponentsUtils";
import ToolBar from "./ToolBar";

export default function ModuleComponents({ value, readonly }) {
  const [focus, setFocus] = useState(-1);

  return (
    <FieldArray name="components">
      {(helpers) => {
        return (
          <FieldArrayContainer>
            <ComponentForm>
              {value.map((component, index) => (
                <ComponentField
                  key={component.key}
                  {...{ index, readonly, component, focus: focus === index }}
                  name="components"
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
}

const FieldArrayContainer = styled.div`
  display: flex;
`;

const ComponentForm = styled.div`
  flex: 1;
`;
