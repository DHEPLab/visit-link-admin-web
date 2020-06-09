import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal, Tabs, Radio, Input, Space } from 'antd';
import styled from 'styled-components';
import { WithPage } from '../components/*';
import Axios from 'axios';

const { TabPane } = Tabs;
export default function Users() {
  const [tab, setTab] = useState('chw');
  const [visible, setVisible] = useState(true);

  return (
    <>
      <h1>账户管理</h1>
      <ButtonGroup>
        <Button type="primary" onClick={() => setVisible(true)}>
          创建新用户
        </Button>
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

      <ModalUserForm
        visible={visible}
        onCancel={() => setVisible(false)}
        onSuccess={() => {
          setVisible(false);
        }}
      />
    </>
  );
}

function ModalUserForm({ ...props }) {
  const [roles] = useState([
    {
      label: '工作人员',
      value: 'ROLE_CHW',
    },
    {
      label: '督导',
      value: 'ROLE_SUPERVISOR',
    },
    {
      label: '管理员',
      value: 'ROLE_ADMIN',
    },
  ]);

  function handleSubmit(value) {
    Axios.post('/adminapi/user', value).then(props.onSuccess);
  }

  return (
    <Modal
      title="添加新用户"
      onOk={handleSubmit}
      footer={null}
      destroyOnClose
      {...props}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ offset: 1 }}
        onFinish={handleSubmit}
        initialValues={{ role: 'ROLE_CHW' }}
      >
        <h3>用户信息</h3>
        <Form.Item label="权限" name="role">
          <Radio.Group>
            {roles.map((role) => (
              <Radio key={role.value} value={role.value}>
                {role.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="真实姓名" name="realName">
          <Input />
        </Form.Item>
        <Form.Item label="ID" name="identity">
          <Input />
        </Form.Item>
        <Form.Item label="联系电话" name="phone">
          <Input />
        </Form.Item>
        <h3>用户信息</h3>
        <Form.Item label="账户名称" name="username">
          <Input />
        </Form.Item>
        <Form.Item label="账户密码" name="password">
          <Input.Password />
        </Form.Item>
        <Space size="large">
          <Button ghost type="primary">
            放弃
          </Button>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Space>
      </Form>
    </Modal>
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
