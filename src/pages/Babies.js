import React from 'react';
import styled from 'styled-components';
import { Table, Button } from 'antd';

import { useBoolState } from '../utils';
import { WithPage } from '../components/*';

function Babies({ dataSource }) {
  const [visible, openBaby, closeBaby] = useBoolState();

  return (
    <>
      <h1>宝宝管理</h1>
      <ButtonGroup>
        <Button type="primary" onClick={openBaby}>
          创建新宝宝
        </Button>
      </ButtonGroup>

      <Table dataSource={dataSource} />
    </>
  );
}

const ButtonGroup = styled.div`
  padding: 10px 0;
  text-align: right;
`;

export default WithPage(Babies, '/admin/baby');
