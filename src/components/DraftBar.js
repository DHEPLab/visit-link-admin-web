import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { Space, Button } from 'antd';

import { DeletePopconfirm } from './*';

export default function DraftBar({
  title = '本课程有1个尚未发布的草稿：',
  onClick,
  onRemove,
  lastModifiedDraftAt,
}) {
  return (
    <Container>
      <Title>{title}</Title>
      <Flex>
        <Label>编辑日期：</Label>
        <Date>{moment(lastModifiedDraftAt).format('YYYY/MM/DD')}</Date>
        <Space size="large">
          <DeletePopconfirm onConfirm={onRemove}>
            <DeleteButton ghost>删除草稿</DeleteButton>
          </DeletePopconfirm>
          <EditButton ghost type="primary" onClick={onClick}>
            继续编辑
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

const Date = styled.div`
  margin-right: 30px;
`;

const EditButton = styled(Button)`
  &.ant-btn.ant-btn-background-ghost {
    background: #fff !important;
    border: none;
  }
`;

const DeleteButton = styled(Button)`
  &.ant-btn.ant-btn-background-ghost {
    border-color: #fff !important;
    color: #fff !important;
  }
`;
