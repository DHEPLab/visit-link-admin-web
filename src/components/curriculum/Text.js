import React from 'react';
import styled from 'styled-components';
import ReactQuill from 'react-quill';

import Container from './Container';
export default function Text({ name, onBlur, onChange, value, ...props }) {
  const Name = {
    html: `${name}.html`,
    type: `${name}.type`,
    toolbar: `toolbar-${name.split('.').join('')}`,
  };

  function type(args) {
    onChange(Name.type)(args);
  }

  return (
    <Container title="文本组件" name={name} {...props} noPadding>
      <QuillContainer className="text-editor">
        <CustomToolbar id={Name.toolbar} value={value.type} />
        <ReactQuill
          theme="snow"
          modules={{
            toolbar: {
              container: `#${Name.toolbar}`,
              handlers: {
                type,
              },
            },
          }}
          defaultValue={value.html}
          onChange={onChange(Name.html)}
        />
      </QuillContainer>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </Container>
  );
}

/*
 * Custom toolbar component including insertStar button and dropdowns
 */
const CustomToolbar = ({ id, value }) => (
  <div id={id}>
    <select className="ql-type" defaultValue={value}>
      <option value="narrate">One</option>
      <option value="hint">Two</option>
      <option value="refrence">Three</option>
    </select>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
  </div>
);

const QuillContainer = styled.div`
  .ql-picker.ql-type {
    width: 90px;
  }

  .ql-picker.ql-type .ql-picker-item::before,
  .ql-picker.ql-type .ql-picker-label::before {
    content: 'Type';
  }

  .ql-picker.ql-type [data-value='narrate']::before {
    content: '叙述文本';
  }

  .ql-picker.ql-type [data-value='hint']::before {
    content: '提示文本';
  }
  .ql-picker.ql-type [data-value='refrence']::before {
    content: '参考文本';
  }

  .ql-container.ql-snow,
  .ql-toolbar.ql-snow {
    border: none;
  }

  .ql-toolbar.ql-snow {
    background: rgba(238, 238, 238, 0.5);
  }
`;
