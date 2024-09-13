import { ChoiceQuestionOption, ChoiceQuestionValue } from "@/models/res/Questionnaire";
import { FieldProps } from "formik/dist/Field";
import { FieldInputProps } from "formik/dist/types";
import React from "react";
import styled from "styled-components";
import { Row, Col, Button, Checkbox, Input } from "antd";
import { FieldArray, Field } from "formik";
import QuestionButton from "../QuestionButton";
import Iconfont from "../Iconfont";
import { useTranslation } from "react-i18next";

import Container, { ContainerProps } from "@/components/Container";

type ForwardContainProps = Pick<
  ContainerProps,
  "readonly" | "focus" | "onFocus" | "onRemove" | "onMoveUp" | "onMoveDown"
>;

type QuestionRadioProps = {
  index: number;
  multiple?: boolean;
} & FieldInputProps<ChoiceQuestionValue> &
  ForwardContainProps;

const EmptyOption = { label: "", needEnter: false } satisfies ChoiceQuestionOption;

const QuestionChoice: React.FC<QuestionRadioProps> = (props) => {
  const { name, multiple = false, value, readonly, focus, onFocus, onRemove, onMoveUp, onMoveDown } = props;
  const { t } = useTranslation("questionRadio");

  return (
    <Container
      icon={multiple ? "iconquestion-checkbox-gray" : "iconquestion-radio-gray"}
      title={multiple ? t("multipleChoiceQuestion") : t("singleChoiceQuestion")}
      noPadding
      readonly={readonly}
      focus={focus}
      onFocus={onFocus}
      onRemove={onRemove}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
    >
      {props.readonly ? (
        <TextTitle>{value.title}</TextTitle>
      ) : (
        <RowLine>
          <Text span={4}>{t("questionText")} </Text>
          <Col span={20}>
            <Field
              name={`${name}.title`}
              validate={(value: string) => (value && `${value}`.trim() ? "" : t("required"))}
            >
              {({ field }: FieldProps<string>) => <TitleInput placeholder={t("enterQuestionText")} {...field} />}
            </Field>
          </Col>
        </RowLine>
      )}

      {props.readonly ? (
        <>
          {value.options &&
            value.options.map((option, i) => (
              <div key={i}>
                <ReadOnlyLine>
                  <Text span="2">
                    {t("option")} {String.fromCharCode(i + 65)}.{" "}
                  </Text>
                  <Text>{option.label}</Text>
                  <Col>{option.needEnter && <Input style={{ marginLeft: 20 }} placeholder={t("pleaseEnter")} />}</Col>
                </ReadOnlyLine>
              </div>
            ))}
        </>
      ) : (
        <FieldArray
          name={`${name}.options`}
          render={(arrayHelper) => (
            <>
              {!readonly && (
                <div onClick={() => arrayHelper.push(EmptyOption)}>
                  <QuestionButton title={t("clickToAddOption")} icon="iconadd-circle-Fill" />
                </div>
              )}
              {value.options.map((_option: ChoiceQuestionOption, optionIndex: number) => (
                <div key={optionIndex}>
                  <RowLine>
                    <Text span={4}>
                      {t("option")} {String.fromCharCode(optionIndex + 65)}.{" "}
                    </Text>
                    <OptionInput>
                      <Field
                        name={`${name}.options.${optionIndex}.label`}
                        validate={(value: string) => (value && `${value}`.trim() ? "" : t("required"))}
                        placeholder={t("pleaseEnterContent")}
                        as={Input}
                      />
                    </OptionInput>
                    <Field name={`${name}.options.${optionIndex}.needEnter`}>
                      {({ field }: FieldProps<boolean>) => (
                        <AddTextCheckbox name={field.name} checked={field.value} onChange={field.onChange}>
                          {t("addTextBox")}
                        </AddTextCheckbox>
                      )}
                    </Field>
                    <Button size="small" type="link" onClick={() => arrayHelper.remove(optionIndex)}>
                      <Iconfont type="icontrash-orange" size={14} /> {t("remove")}
                    </Button>
                  </RowLine>
                </div>
              ))}
            </>
          )}
        />
      )}
    </Container>
  );
};

const RowLine = styled(Row)`
  display: flex;
  margin: 10px 16px;
`;

const ReadOnlyLine = styled(Row)`
  margin-left: 40px;
  margin-bottom: 10px;
`;

const TitleInput = styled(Input)`
  width: 100% !important;
`;

const TextTitle = styled.div`
  font-weight: 600;
  margin: 20px 0 20px 40px;
`;

const Text = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: justify;
  color: #8e8e93;
  font-weight: 500;
`;

const OptionInput = styled.div`
  flex: 1;
  width: 100%;
  padding-right: 24px;

  .ant-input {
    width: 100%;
  }
`;

const AddTextCheckbox = styled(Checkbox)`
  display: flex;
  align-items: center;
  white-space: nowrap;
  color: #ff7c53;
  font-weight: 600;
  margin-bottom: 8px;
`;

export default QuestionChoice;
export const QuestionSingleChoice = (props: QuestionRadioProps) => <QuestionChoice multiple={false} {...props} />;
export const QuestionMultipleChoice = (props: QuestionRadioProps) => <QuestionChoice multiple {...props} />;
