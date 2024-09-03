import React, { useState } from "react";
import styled from "styled-components";
import { Button, Cascader, message } from "antd";
import { FieldArray } from "formik";
import { useTranslation } from "react-i18next";

import Factory from "./factory";
import ComponentField from "./ComponentField";
import Container from "./Container";
import GhostInput from "../GhostInput";
import { useModuleStore } from "@/store/module";

export default function Case({ name, value, index, onChange, ...props }) {
  const [text, setText] = useState(value.text);
  const options = useModuleStore((state) => state.options);
  const { t } = useTranslation("case");

  const Name = {
    text: `${name}.text`,
    finishAction: `${name}.finishAction`,
    components: `${name}.components`,
  };

  function onChangeCascader(finishAction) {
    onChange(Name.finishAction)({ target: { value: finishAction } });
  }

  return (
    <Container
      {...props}
      title={t("option", { index: index + 1 })}
      name={name}
      hideMove
      extra={
        <StyledCascader
          allowClear={false}
          disabled={props.readonly}
          options={options}
          value={value.finishAction}
          onChange={onChangeCascader}
          size="small"
          placeholder={t("selectOptionEndJump")}
        />
      }
    >
      <GhostInputContainer>
        <GhostInput
          disabled={props.readonly}
          name={Name.text}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => onChange(Name.text)(text)}
          placeholder={t("enterOptionText")}
        />
      </GhostInputContainer>
      <FieldArray name={Name.components}>
        {(helpers) => {
          function handleMoveUp(index) {
            if (index === 0) return;
            helpers.move(index, index - 1);
          }

          function handleMoveDown(index) {
            if (index === value.components.length - 1) return;
            helpers.move(index, index + 1);
          }

          function handleAddSwitch() {
            if (name.split(".cases").length > 2) {
              message.warning(t("maxNestedLevels"));
              return;
            }
            helpers.push(Factory.createSwitch());
          }

          return (
            <>
              {value.components.map((component, index) => (
                <ComponentField
                  {...props}
                  index={index}
                  key={component.key}
                  name={Name.components}
                  component={component}
                  onRemove={() => helpers.remove(index)}
                  onMoveUp={() => handleMoveUp(index)}
                  onMoveDown={() => handleMoveDown(index)}
                />
              ))}
              {!props.readonly && (
                <div>
                  <Button type="link" onClick={() => helpers.push(Factory.createText())}>
                    {t("addText")}
                  </Button>
                  <Button type="link" onClick={() => helpers.push(Factory.createMedia())}>
                    {t("addMedia")}
                  </Button>
                  <Button type="link" onClick={handleAddSwitch}>
                    {t("addChoice")}
                  </Button>
                </div>
              )}
            </>
          );
        }}
      </FieldArray>
    </Container>
  );
}

const StyledCascader = styled(Cascader)`
  .ant-input {
    border-radius: 8px;
  }
`;

const GhostInputContainer = styled.div`
  padding: 20px;
`;
