import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Space, Button } from 'antd';
import { ReviewActionFromApp } from '../constants/enums';

export default function BabyReviewBar({ baby, onApprove }) {
  return (
    <Container>
      <Title>审核类型：{ReviewActionFromApp[baby.actionFromApp]} </Title>
      <Flex>
        <Label>注销原因：</Label>
        <Value>{baby.closeAccountReason}</Value>
        <Label>修改日期：</Label>
        {baby.lastModifiedAt && <Value>{moment(baby.lastModifiedAt).format('YYYY/MM/DD')}</Value>}
        <Space size="large">
          <EditButton ghost type="primary" onClick={onApprove}>
            批准申请
          </EditButton>
        </Space>
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

const Value = styled.div`
  margin-right: 30px;
`;

const EditButton = styled(Button)`
  &.ant-btn.ant-btn-background-ghost {
    background: #fff !important;
    border: none;
  }
`;
