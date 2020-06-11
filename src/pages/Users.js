import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal, Tabs, Radio, Input, Space } from 'antd';
import styled from 'styled-components';
import { WithPage } from '../components/*';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';

const { TabPane } = Tabs;
export default function Users() {
  const [tab, setTab] = useState('chw');
  const [visible, setVisible] = useState(false);
  const history = useHistory();

  // change tab to refresh table
  function refresh() {
    const origin = tab;
    setTab('Not Exist');
    setTab(origin);
  }

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
          <PageCHW tab={tab} history={history} />
        </TabPane>
        <TabPane tab="督导" key="supervisor">
          <PageSupervisor tab={tab} history={history} />
        </TabPane>
        <TabPane tab="管理员" key="admin">
          <PageAdmin tab={tab} history={history} />
        </TabPane>
      </Tabs>

      <ModalUserForm
        visible={visible}
        onCancel={() => setVisible(false)}
        onSuccess={() => {
          refresh();
          setVisible(false);
        }}
      />
    </>
  );
}

function ModalUserForm({ onSuccess, ...props }) {
  const [form] = Form.useForm();
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
    Axios.post('/admin/user', value).then(onSuccess);
  }

  return (
    <Modal
      title="添加新用户"
      onOk={handleSubmit}
      footer={
        <Space>
          <Button ghost type="primary" onClick={props.onCancel}>
            放弃
          </Button>
          <Button type="primary" onClick={form.submit}>
            提交
          </Button>
        </Space>
      }
      destroyOnClose
      {...props}
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ offset: 1 }}
        onFinish={handleSubmit}
        initialValues={{ role: 'ROLE_CHW' }}
      >
        <h3>用户信息</h3>
        <Form.Item label="权限" name="role" rules={[{ required: true }]}>
          <Radio.Group>
            {roles.map((role) => (
              <Radio key={role.value} value={role.value}>
                {role.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="真实姓名" name="realName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(old, curr) => old.role !== curr.role}>
          {({ getFieldValue }) => (
            <>
              {getFieldValue('role') === 'ROLE_CHW' && (
                <Form.Item label="ID" name={['chw', 'identity']} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              )}
            </>
          )}
        </Form.Item>
        <Form.Item label="联系电话" name="phone" rules={[{ required: true, min: 11, max: 11 }]}>
          <Input />
        </Form.Item>
        <h3>账户信息</h3>
        <Form.Item label="账户名称" name="username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="账户密码" name="password" rules={[{ required: true, min: 6 }]}>
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
}

const PageCHW = WithPage(CHW, '/admin/user/chw', {}, false);
const PageSupervisor = WithPage(Supervisor, '/admin/user/supervisor', {}, false);
const PageAdmin = WithPage(Admin, '/admin/user/admin', {}, false);

function CHW({ tab, history, dataSource, pagination, loadData, onChangePage }) {
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
            align: 'center',
            dataIndex: ['chw', 'identity'],
          },
          phone,
          {
            title: '督导',
            align: 'center',
            dataIndex: ['chw', 'supervisor', 'realName'],
          },
          username,
          operation(history),
        ]}
      />
    </div>
  );
}

function Supervisor({ tab, history, dataSource, pagination, loadData, onChangePage }) {
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
        columns={[realName, phone, username, operation(history)]}
      />
    </div>
  );
}

function Admin({ tab, history, dataSource, pagination, loadData, onChangePage }) {
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
        columns={[realName, phone, username, operation(history)]}
      />
    </div>
  );
}

const realName = {
  title: '工作人员姓名',
  align: 'center',
  dataIndex: 'realName',
};

const phone = {
  title: '联系电话',
  align: 'center',
  dataIndex: 'phone',
};

const username = {
  title: '账户名称',
  align: 'center',
  dataIndex: 'username',
};

const operation = (history) => ({
  title: '操作',
  dataIndex: 'id',
  align: 'center',
  render(id) {
    return (
      <Button type="link" onClick={() => history.push(`/users/${id}`)}>
        查看
      </Button>
    );
  },
});

const ButtonGroup = styled.div`
  padding: 10px 0;
  text-align: right;
`;
