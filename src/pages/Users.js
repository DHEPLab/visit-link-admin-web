import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Tabs } from 'antd';
import styled from 'styled-components';
import { UserForm, WithPage } from '../components/*';

const { TabPane } = Tabs;
export default function () {
  const [tab, setTab] = useState('chw');

  return (
    <>
      <h1>Account Management</h1>
      <ButtonGroup>
        <Button type="primary">Add a new account</Button>
      </ButtonGroup>
      <Tabs onChange={setTab}>
        <TabPane tab="工作人员" key="chw">
          <PageCHW tab={tab} />
        </TabPane>
        <TabPane tab="督导" key="supervisor">
          <PageSupervisor tab={tab} />
        </TabPane>
        <TabPane tab="管理员" key="admin">
          <PageAdmin tab={tab} />
        </TabPane>
      </Tabs>
      {/* 
      <Modal
        title="Add new account"
        visible={visible}
        onOk={handleSubmitUser}
        onCancel={() => setVisible(false)}
      >
        <UserForm />
      </Modal> */}
    </>
  );
}

const PageCHW = WithPage(
  CHW,
  '/adminapi/user',
  {
    role: 'ROLE_CHW',
  },
  false
);
const PageSupervisor = WithPage(
  Supervisor,
  '/adminapi/user',
  {
    role: 'ROLE_SUPERVISOR',
  },
  false
);
const PageAdmin = WithPage(
  Admin,
  '/adminapi/user',
  {
    role: 'ROLE_ADMIN',
  },
  false
);

function CHW({ tab, dataSource, pagination, loadData, onChangePage }) {
  useEffect(() => {
    tab === 'chw' && loadData();
  }, [tab, loadData]);

  return (
    <div>
      <Table
        rowKey="id"
        dataSource={dataSource}
        pagination={pagination}
        onChange={onChangePage}
        columns={[
          realName,
          {
            title: 'ID',
            dataIndex: 'identity',
          },
          phone,
          username,
          {
            title: '操作',
            dataIndex: 'id',
          },
        ]}
      />
    </div>
  );
}

function Supervisor({ tab, dataSource, pagination, loadData, onChangePage }) {
  useEffect(() => {
    tab === 'supervisor' && loadData();
  }, [tab, loadData]);

  return (
    <div>
      <Table
        rowKey="id"
        dataSource={dataSource}
        pagination={pagination}
        onChange={onChangePage}
        columns={[
          realName,
          phone,
          username,
          {
            title: '操作',
            dataIndex: 'id',
          },
        ]}
      />
    </div>
  );
}

function Admin({ tab, dataSource, pagination, loadData, onChangePage }) {
  useEffect(() => {
    tab === 'admin' && loadData();
  }, [tab, loadData]);

  return (
    <div>
      <Table
        rowKey="id"
        dataSource={dataSource}
        pagination={pagination}
        onChange={onChangePage}
        columns={[
          realName,
          phone,
          username,
          {
            title: '操作',
            dataIndex: 'id',
          },
        ]}
      />
    </div>
  );
}

const realName = {
  title: '工作人员姓名',
  dataIndex: 'realName',
};

const phone = {
  title: '联系电话',
  dataIndex: 'phone',
};

const username = {
  title: '账户名称',
  dataIndex: 'username',
};

const ButtonGroup = styled.div`
  padding: 10px 0;
  text-align: right;
`;
