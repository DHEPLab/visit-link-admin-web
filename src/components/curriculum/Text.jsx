import React from "react";
import styled from "@emotion/styled";
import { useQuill } from "@/hooks/useQuill";
import "quill/dist/quill.snow.css";
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Text({ name, onBlur, onChange, value, ...props }) {
  const types = ["instruction", "script", "reference"];
  const modules = {
    toolbar: {
      container: props.readonly
        ? []
        : [[{ type: [value.type, ...types.filter((item) => item !== value.type)] }], ...container],
      handlers: {
        type: function (args) {
          if (!args) return;
          onChange(Name.type)(args);
        },
      },
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const Name = {
    html: `${name}.html`,
    type: `${name}.type`,
  };

  const { t } = useTranslation("text");
  const { Quill, quill, quillRef } = useQuill({
    theme: "snow",
    modules,
    readOnly: props.readonly,
    placeholder: t("enterTextContent"),
  });
  const typeLabels = {
    script: t("script"),
    instruction: t("instruction"),
    reference: t("reference"),
  };

  if (Quill && !quill) {
    const Clipboard = Quill.import("modules/clipboard");
    const Delta = Quill.import("delta");

    class PlainClipboard extends Clipboard {
      onPaste(range, { text }) {
        const delta = new Delta().retain(range.index).delete(range.length).insert(text);
        const index = text.length + range.index;
        const length = 0;
        this.quill.updateContents(delta, "user");
        this.quill.setSelection(index, length, "silent");
        this.quill.scrollSelectionIntoView();
      }
    }

    Quill.register("modules/clipboard", PlainClipboard, true);
  }

  const debouncedOnChange = debounce(onChange(Name.html), 1000);
  React.useEffect(() => {
    if (quill) {
      quill.clipboard.dangerouslyPasteHTML(value.html);

      quill.on("text-change", () => {
        debouncedOnChange(quill.root.innerHTML);
      });
    }
  }, [quill]);

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
        <div ref={quillRef} />
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
