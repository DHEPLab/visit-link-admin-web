import React from "react";
import styled from "styled-components";
import { Quill } from "react-quill";
import { useFormikContext } from 'formik'
import { Input } from 'antd';

import Container from "./Container";

const colors = {
  text: "#3490de",
  radio: "#05bfb2",
  checkbox: "#6a2c70",
};

const typeLabels = {
  text: "文本问题",
  radio: "单选问题",
  checkbox: "多选问题",
};

export default function QuestionText({ name, onBlur, onChange, value, ...props }) {

  const { handleChange } = useFormikContext()

  function TextChange (name, value) {
    const onChange = handleChange(`${name}`)
    onChange({ target: { value } })
  }

  return (
    <Container
      right={props.readonly && <TextType color={colors[value.type]}>{typeLabels[value.type]}</TextType>}
      icon="iconquestion-text-gray"
      title="文本问题"
      name={`${name}.title`}
      noPadding
      {...props}
    >
      {props.readonly? <TextTitle>{value.title}</TextTitle> :
        <Text
          defaultValue={value.title}
          placeholder="请输入叙述文本内容"
          onBlur={e => TextChange(`${name}.title`, e.target.value)}
          bordered={false} />}
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
`

const Text = styled(Input.TextArea)`
  width: 100%
`
