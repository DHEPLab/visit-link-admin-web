import React from "react";
import styled from "styled-components";
import ReactQuill, { Quill } from "react-quill";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";

import Container from "./Container";

const container = [
  ["bold", "italic"],
  [{ list: "ordered" }, { list: "bullet" }],
];

const colors = {
  script: "#3490de",
  instruction: "#05bfb2",
  reference: "#6a2c70",
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Text({ name, onBlur, onChange, value, ...props }) {
  const { t } = useTranslation("text");

  const typeLabels = {
    script: t("script"),
    instruction: t("instruction"),
    reference: t("reference"),
  };

  const types = ["instruction", "script", "reference"];
  const Name = {
    html: `${name}.html`,
    type: `${name}.type`,
  };

  function type(args) {
    if (!args) return;
    onChange(Name.type)(args);
  }

  function toolbarContainer() {
    return props.readonly
      ? []
      : [[{ type: [value.type, ...types.filter((item) => item !== value.type)] }], ...container];
  }

  return (
    <Container
      right={props.readonly && <TextType color={colors[value.type]}>{typeLabels[value.type]}</TextType>}
      icon="icontext-gray"
      title={t("textComponent")}
      name={name}
      noPadding
      {...props}
    >
      <QuillContainer className="text-editor" readonly={props.readonly} typeLabels={typeLabels} colors={colors} t={t}>
        <ReactQuill
          readOnly={props.readonly}
          theme="snow"
          modules={{
            toolbar: {
              container: toolbarContainer(),
              handlers: {
                type,
              },
            },
          }}
          defaultValue={value.html}
          onChange={debounce(onChange(Name.html), 1000)}
          placeholder={t("enterTextContent")}
        />
      </QuillContainer>
    </Container>
  );
}

const TextType = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: ${({ color }) => color};
`;

const QuillContainer = styled.div`
  ${({ readonly }) =>
    readonly &&
    `
  .ql-toolbar.ql-snow {
    padding: 0;
    height: 0;
  }
  `}

  .ql-picker.ql-type {
    width: 90px;
  }

  .ql-picker.ql-type .ql-picker-item::before,
  .ql-picker.ql-type .ql-picker-label::before {
    content: "${(props) => props.t("type")}";
  }

  .ql-picker.ql-type [data-value="script"]::before {
    content: "${(props) => props.typeLabels.script}";
    color: ${(props) => props.colors.script};
  }

  .ql-picker.ql-type [data-value="instruction"]::before {
    content: "${(props) => props.typeLabels.instruction}";
    color: ${(props) => props.colors.instruction};
  }

  .ql-picker.ql-type [data-value="reference"]::before {
    content: "${(props) => props.typeLabels.reference}";
    color: ${(props) => props.colors.reference};
  }

  .ql-container.ql-snow,
  .ql-toolbar.ql-snow {
    border: none;
  }

  .ql-toolbar.ql-snow {
    background: rgba(238, 238, 238, 0.5);
  }

  .ql-editor {
    min-height: 126px;
  }
`;
