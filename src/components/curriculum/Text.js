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

  function insertCustomTags(args) {
    console.log('insertCustomTags', args);

    const value = args[0];
    onChange(Name.type)(value);
  }

  return (
    <Container title="文本组件" name={name} {...props}>
      <QuillContainer className="text-editor">
        <CustomToolbar id={Name.toolbar} value={value.type} />
        <ReactQuill
          theme="snow"
          modules={{
            toolbar: {
              container: `#${Name.toolbar}`,
              handlers: {
                insertCustomTags: insertCustomTags,
              },
            },
          }}
          value={value.html}
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
    <select className="ql-insertCustomTags" defaultValue={value}>
      <option value="1">One</option>
      <option value="2">Two</option>
      <option value="3">Three</option>
    </select>
    <select className="ql-header">
      <option value="1"></option>
      <option value="2"></option>
      <option selected></option>
    </select>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <select className="ql-color">
      <option value="red"></option>
      <option value="green"></option>
      <option value="blue"></option>
      <option value="orange"></option>
      <option value="violet"></option>
      <option value="#d0d1d2"></option>
      <option selected></option>
    </select>
  </div>
);

const QuillContainer = styled.div`
  .ql-picker.ql-insertCustomTags {
    width: 90px;
  }

  .ql-picker.ql-insertCustomTags .ql-picker-item::before,
  .ql-picker.ql-insertCustomTags .ql-picker-label::before {
    content: 'Custom';
  }

  .ql-picker.ql-insertCustomTags [data-value='1']::before {
    content: '叙述文本';
  }

  .ql-picker.ql-insertCustomTags [data-value='2']::before {
    content: '提示文本';
  }
  .ql-picker.ql-insertCustomTags [data-value='3']::before {
    content: '参考文本';
  }
`;
