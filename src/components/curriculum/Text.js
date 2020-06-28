import React, { useState } from 'react';
import Quill from 'react-quill';
import styled from 'styled-components';

const toolbar = [
  ['bold', 'italic', 'underline'], // toggled buttons
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ align: [] }],
];

export default function Text(props) {
  const [value, setValue] = useState(props.value);

  return (
    <Container>
      <Quill theme="snow" modules={{ toolbar }} value={value} onChange={setValue} />
    </Container>
  );
}

const Container = styled.div`
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px 20px;
  margin-bottom: 10px;
`;
