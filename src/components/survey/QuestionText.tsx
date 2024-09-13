import Container, { ContainerProps } from "@/components/Container";
import { TextQuestionValue } from "@/models/res/Questionnaire";
import { Input } from "antd";
import { Field } from "formik";
import { FieldProps } from "formik/dist/Field";
import { FieldInputProps } from "formik/dist/types";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

type ForwardContainProps = Pick<
  ContainerProps,
  "readonly" | "focus" | "onFocus" | "onRemove" | "onMoveUp" | "onMoveDown"
>;

type QuestionTextProps = {
  readonly: boolean;
} & FieldInputProps<TextQuestionValue> &
  ForwardContainProps;

const QuestionText: React.FC<QuestionTextProps> = (props) => {
  const { name, value, readonly, focus, onFocus, onRemove, onMoveUp, onMoveDown } = props;
  const { t } = useTranslation("questionText");

  return (
    <Container
      icon="iconquestion-text-gray"
      title={t("textQuestion")}
      noPadding
      readonly={readonly}
      focus={focus}
      onFocus={onFocus}
      onRemove={onRemove}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
    >
      {readonly ? (
        <TextTitle>{value.title}</TextTitle>
      ) : (
        <Field name={`${name}.title`} validate={(value: string) => (value && `${value}`.trim() ? "" : t("required"))}>
          {({ field }: FieldProps<string>) => <Text placeholder={t("enterText")} variant="borderless" {...field} />}
        </Field>
      )}
    </Container>
  );
};

const TextTitle = styled.div`
  font-weight: 600;
  margin: 20px 0 20px 40px;
`;

const Text = styled(Input.TextArea)`
  width: 100%;
`;

export default QuestionText;
