import React from 'react';
import styled from 'styled-components';

export default function Published({ value }) {
  if (value) {
    return <PublishedContainer>已发布</PublishedContainer>;
  }
  return <UnpublishContainer>草稿</UnpublishContainer>;
}

const PublishedContainer = styled.div`
  display: inline-block;
  width: 56px;
  height: 20px;
  line-height: 20px;
  background: #d7f3de;
  border-radius: 4px;
  color: #64cf7f;
  font-size: 12px;
  text-align: center;
`;

const UnpublishContainer = styled(PublishedContainer)`
  color: #ff794f;
  background: #ffede2;
`;
