import React from "react";
import styled from "styled-components";
import { useFormikContext, Field } from "formik";
import { Input } from "antd";
import { useTranslation } from "react-i18next";

import Container from "@/components/Container";

const colors = {
  text: "#3490de",
  radio: "#05bfb2",
  checkbox: "#6a2c70",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function QuestionText({ name, onBlur, onChange, value, ...props }) {
  const { handleChange } = useFormikContext();
  const { t } = useTranslation("questionText");

  const typeLabels = {
    text: t("textQuestion"),
    radio: t("singleChoiceQuestion"),
    checkbox: t("multipleChoiceQuestion"),
  };

  function TextChange(name, value) {
    const onChange = handleChange(`${name}`);
    onChange({ target: { value } });
  }

  return (
    <Container
      right={props.readonly && <TextType color={colors[value.type]}>{typeLabels[value.type]}</TextType>}
      icon="iconquestion-text-gray"
      title={t("textQuestion")}
      name={`${name}.title`}
      noPadding
      {...props}
    >
      {props.readonly ? (
        <TextTitle>{value.title}</TextTitle>
      ) : (
        <Text
          defaultValue={value.title}
          placeholder={t("enterText")}
          onBlur={(e) => TextChange(`${name}.title`, e.target.value)}
          variant="borderless"
        />
      )}
      <Field
        name={`${name}.title`}
        validate={(value) => (value && `${value}`.trim() ? "" : t("required"))}
        style={{ display: "none" }}
      />
    </Container>
  );
}

const TextType = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: ${({ color }) => color};
`;

const TextTitle = styled.div`
  font-weight: 600;
  margin: 20px 0px 20px 40px;
`;

const Text = styled(Input.TextArea)`
  width: 100%;
`;
