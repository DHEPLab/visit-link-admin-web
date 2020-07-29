import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';

import Container from './Container';
import { Iconfont } from '../*';

export default function PageFooter(props) {
  return (
    <Container
      component={<PageFooterTitle onRemove={props.onRemove} readonly={props.readonly} />}
      {...props}
    />
  );
}

function PageFooterTitle({ onRemove, readonly }) {
  return (
    <TitleContainer>
      <Title>翻页分割线</Title>
      <SplitLine />
      {!readonly && (
        <Button size="small" type="link" onClick={onRemove}>
          <Iconfont type="icontrash-orange" size={14} /> 移除
        </Button>
      )}
    </TitleContainer>
  );
}

const SplitLine = styled.div`
  height: 4px;
  flex: 1;
  background-image: linear-gradient(to right, #ff794f 50%, rgba(255, 255, 255, 0) 0%);
  background-position: bottom;
  background-size: 14px 3px;
  background-repeat: repeat-x;
  margin: 0 30px;
`;

const Title = styled.div`
  color: #8e8e93;
  font-weight: bold;
`;

const TitleContainer = styled.div`
  flex: 1;
  height: 52px;
  border-radius: 8px;
  border: 2px solid #eee;
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  padding: 0 30px;
  justify-content: space-between;
`;
