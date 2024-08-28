import React from "react";
import styled from "styled-components";
import { Input, Row, Col, Button } from "antd";
import { useFormikContext, FieldArray, Field } from "formik";
import { Checkbox } from "formik-antd";
import { QuestionButton, Iconfont } from "..";
import { useTranslation } from "react-i18next";

import Container from "./Container";

const colors = {
  text: "#3490de",
  radio: "#05bfb2",
  checkbox: "#6a2c70",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function QuestionRadio({ name, onBlur, onChange, value, index, ...props }) {
  const { values, handleChange } = useFormikContext();
  const type = values.questions[index]?.type;
  const { t } = useTranslation("questionRadio");

  const typeLabels = {
    text: t("textQuestion"),
    radio: t("singleChoiceQuestion"),
    checkbox: t("multipleChoiceQuestion"),
  };

  function addOptions(arrayHelper) {
    arrayHelper.push({ label: "", needEnter: false });
  }

  function handlerRadioChange(name, value) {
    const onChange = handleChange(`${name}`);
    onChange({ target: { value } });
  }

  function handlerRemove(arrayHelper, i) {
    arrayHelper.remove(i);
  }

  return (
    <Container
      right={props.readonly && <TextType color={colors[type]}>{typeLabels[type]}</TextType>}
      icon={type === "Radio" ? "iconquestion-radio-gray" : "iconquestion-checkbox-gray"}
      title={type === "Radio" ? t("singleChoiceQuestion") : t("multipleChoiceQuestion")}
      name={name}
      noPadding
      {...props}
    >
      {props.readonly ? (
        <TextTitle>{value.title}</TextTitle>
      ) : (
        <RowLine>
          <Text span={4}>{t("questionText")} </Text>
          <Col span={20}>
            <TitleInput
              name={`${name}.title`}
              defaultValue={value.title}
              placeholder={t("enterQuestionText")}
              onBlur={(e) => handlerRadioChange(`${name}.title`, e.target.value)}
            />
            <Field
              name={`${name}.title`}
              validate={(value) => (value && `${value}`.trim() ? "" : t("required"))}
              style={{ display: "none" }}
            />
          </Col>
        </RowLine>
      )}

      {props.readonly ? (
        <>
          {value.options &&
            value.options.map((e, i) => (
              <div key={i}>
                <ReadOnlyLine>
                  <Text span="2">
                    {t("option")} {String.fromCharCode(i + 65)}.{" "}
                  </Text>
                  <Text>{value.options[i]?.label}</Text>
                  <Col>
                    {value.options[i]?.needEnter && <Input style={{ marginLeft: 20 }} placeholder={t("pleaseEnter")} />}
                  </Col>
                </ReadOnlyLine>
              </div>
            ))}
        </>
      ) : (
        <FieldArray
          name={`${name}.options`}
          render={(arrayHelper) => (
            <>
              {!props.readonly && (
                <div onClick={() => addOptions(arrayHelper)}>
                  <QuestionButton title={t("clickToAddOption")} icon="iconadd-circle-Fill" />
                </div>
              )}
              {value.options &&
                value.options.map((e, i) => (
                  <div key={i}>
                    <RowLine>
                      <Text span={4}>
                        {t("option")} {String.fromCharCode(i + 65)}.{" "}
                      </Text>
                      <Col span={12}>
                        <Field
                          name={`${name}.options.${i}.label`}
                          validate={(value) => (value && `${value}`.trim() ? "" : t("required"))}
                          defaultValue={e.label}
                          placeholder={t("pleaseEnterContent")}
                          style={{ width: 360 }}
                          as={Input}
                        />
                      </Col>
                      <Col span={3}>
                        <AddTextCheckbox
                          name={`${name}.options.${i}.needEnter`}
                          defaultChecked={e.needEnter}
                          onChange={(e) => handlerRadioChange(`${name}.options.${i}.needEnter`, e.target.checked)}
                        >
                          {t("addTextBox")}
                        </AddTextCheckbox>
                      </Col>
                      <Col span={3}>
                        <Button size="small" type="link" onClick={() => handlerRemove(arrayHelper, i)}>
                          <Iconfont type="icontrash-orange" size={14} /> {t("remove")}
                        </Button>
                      </Col>
                    </RowLine>
                  </div>
                ))}
              <Field
                name={`${name}.options`}
                style={{ display: "none" }}
                validate={(options) => (options && options.length > 0 ? "" : t("cantBeEmpty"))}
              />
            </>
          )}
        />
      )}
    </Container>
  );
}

const TextType = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: ${({ color }) => color};
`;

const RowLine = styled(Row)`
  margin: 10px auto;
`;

const ReadOnlyLine = styled(Row)`
  margin-left: 40px;
  margin-bottom: 10px;
`;

const TitleInput = styled(Input)`
  width: 35vw !important;
`;

const TextTitle = styled.div`
  font-weight: 600;
  margin: 20px 0px 20px 40px;
`;

const Text = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: justify;
  color: #8e8e93;
  font-weight: 500;
`;

const AddTextCheckbox = styled(Checkbox)`
  color: #ff7c53;
  font-weight: 600;
`;
