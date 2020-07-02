import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

export default function DraftBar() {
  return (
    <Container>
      <Title>本课程有1个尚未发布的草稿：</Title>
      <Flex>
        <Label>编辑日期：</Label>
        <Date>2020/06/30</Date>
        <StyledButton ghost type="primary">
          继续编辑
        </StyledButton>
      </Flex>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 70px;
  margin-bottom: 20px;
  background-color: #ff9472;
  color: #fff;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.div`
  color: #ffede2;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const Date = styled.div`
  margin-right: 30px;
`;

const StyledButton = styled(Button)`
  &.ant-btn.ant-btn-background-ghost {
    background: #fff !important;
    border: none;
  }
`;
