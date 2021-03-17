import React from "react";
import styled from "styled-components";
import { Quill } from "react-quill";
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

// https://stackoverflow.com/questions/41237486/how-to-paste-plain-text-in-a-quill-based-editor
const Clipboard = Quill.import("modules/clipboard");
const Delta = Quill.import("delta");

class PlainClipboard extends Clipboard {
  onPaste(e) {
    e.preventDefault();
    const range = this.quill.getSelection();
    const text = e.clipboardData.getData("text/plain");
    const delta = new Delta().retain(range.index).delete(range.length).insert(text);
    const index = text.length + range.index;
    const length = 0;
    this.quill.updateContents(delta, "silent");
    this.quill.setSelection(index, length, "silent");
    this.quill.scrollIntoView();
  }
}
Quill.register("modules/clipboard", PlainClipboard, true);

export default function QuestionText({ name, onBlur, onChange, value, ...props }) {

  return (
    <Container
      right={props.readonly && <TextType color={colors[value.type]}>{typeLabels[value.type]}</TextType>}
      icon="icontext-gray"
      title="文本问题"
      name={`${name}.title`}
      noPadding
      {...props}
    >
      {props.readonly? <TextTitle>{value.title}</TextTitle> : <Text defaultValue={value.title} placeholder="请输入叙述文本内容" bordered={false} />}
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
