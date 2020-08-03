import React from 'react';
import styled from 'styled-components';
import ReactQuill, { Quill } from 'react-quill';
import { debounce } from 'lodash';

import Container from './Container';

const container = [
  ['bold', 'italic'],
  [{ list: 'ordered' }, { list: 'bullet' }],
];

// https://stackoverflow.com/questions/41237486/how-to-paste-plain-text-in-a-quill-based-editor
const Clipboard = Quill.import('modules/clipboard');
const Delta = Quill.import('delta');

class PlainClipboard extends Clipboard {
  onPaste(e) {
    e.preventDefault();
    const range = this.quill.getSelection();
    const text = e.clipboardData.getData('text/plain');
    const delta = new Delta().retain(range.index).delete(range.length).insert(text);
    const index = text.length + range.index;
    const length = 0;
    this.quill.updateContents(delta, 'silent');
    this.quill.setSelection(index, length, 'silent');
    this.quill.scrollIntoView();
  }
}
Quill.register('modules/clipboard', PlainClipboard, true);

export default function Text({ name, onBlur, onChange, value, ...props }) {
  const types = ['instruction', 'script', 'refrence'];
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
      : // use quill toolbar default value echo type, put current type to first item
        [[{ type: [value.type, ...types.filter((item) => item !== value.type)] }], ...container];
  }

  return (
    <Container icon="icontext-gray" title="文本组件" name={name} {...props} noPadding>
      <QuillContainer className="text-editor" readonly={props.readonly}>
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
          // Debounce trigger that formik on change event
          // fix typing Chinese always automatically triggers onChange
          onChange={debounce(onChange(Name.html), 1000)}
          placeholder="请输入文本内容"
        />
      </QuillContainer>
      {/* <pre>{JSON.stringify(value, null, 2)}</pre> */}
    </Container>
  );
}

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
    content: 'Type';
  }

  .ql-picker.ql-type [data-value='script']::before {
    content: '叙述文本';
    color: #3490de;
  }

  .ql-picker.ql-type [data-value='instruction']::before {
    content: '提示文本';
    color: #05bfb2;
  }
  .ql-picker.ql-type [data-value='refrence']::before {
    content: '参考文本';
    color: #6a2c70;
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
