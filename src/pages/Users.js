import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Select, Form, Button, Table, Modal, Tabs, Radio, Input, Space } from 'antd';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { useBoolState } from '../utils';
import { WithPage } from '../components/*';
import { Role } from '../constants/enums';

const { TabPane } = Tabs;
export default function Users() {
  const [tab, setTab] = useState('chw');
  const [visible, openUser, closeUser] = useBoolState();
  const history = useHistory();

  // change tab to refresh table
  function refresh() {
    const origin = tab;
    setTab(Math.random());
    setTab(origin);
  }

  return (
    <>
      <h1>账户管理</h1>
      <ButtonGroup>
        <Button type="primary" onClick={openUser}>
          创建新用户
        </Button>
      </ButtonGroup>
      <Tabs onChange={setTab}>
        <TabPane tab="社区工作者" key="chw">
          <PageCHW tab={tab} history={history} />
        </TabPane>
        <TabPane tab="督导" key="supervisor">
          <PageSupervisor tab={tab} history={history} />
        </TabPane>
        <TabPane tab="管理员" key="admin">
          <PageAdmin tab={tab} history={history} />
        </TabPane>
      </Tabs>

      <UserFormModal
        visible={visible}
        onCancel={closeUser}
        onSuccess={() => {
          refresh();
          closeUser();
        }}
      />
    </>
  );
}

function UserFormModal({ onSuccess, ...props }) {
  const [form] = Form.useForm();

  useEffect(() => {
    props.visible && form.resetFields();
  }, [props, form]);

  function handleSubmit(value) {
    Axios.post('/admin/user', value).then(onSuccess);
  }

  return (
    <Modal
      width={600}
      closable={false}
      maskClosable={false}
      destroyOnClose
      title="添加新用户"
      footer={
        <Space size="large">
          <Button ghost type="primary" size="large" onClick={props.onCancel}>
            放弃
          </Button>
          <Button type="primary" size="large" onClick={form.submit}>
            提交
          </Button>
        </Space>
      }
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
            {Object.keys(Role).map((key) => (
              <Radio key={key} value={key}>
                {Role[key]}
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
                <>
                  <Form.Item label="ID" name={['chw', 'identity']} rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="所在区域" name={['chw', 'tags']} rules={[{ required: true }]}>
                    <Select mode="tags" />
                  </Form.Item>
                </>
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
        rowKey={(record) => record.user.id}
        dataSource={dataSource}
        pagination={pagination}
        onChange={onChangePage}
        columns={[
          realName,
          {
            title: 'ID',
            align: 'center',
            dataIndex: ['user', 'chw', 'identity'],
          },
          {
            title: '所在区域',
            align: 'center',
            dataIndex: ['user', 'chw', 'tags'],
            render: (tags) => tags && tags.join(', '),
          },
          phone,
          {
            title: '督导',
            align: 'center',
            dataIndex: ['user', 'chw', 'supervisor', 'realName'],
          },
          {
            title: '负责宝宝',
            align: 'center',
            dataIndex: 'babyCount',
            render: (h) => `${h} 位`,
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
        rowKey={(record) => record.user.id}
        dataSource={dataSource}
        pagination={pagination}
        onChange={onChangePage}
        columns={[
          realName,
          phone,
          {
            title: '负责社区工作者',
            dataIndex: 'chwCount',
            align: 'center',
            render: (h) => `${h} 位`,
          },
          username,
          operation(history),
        ]}
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
        columns={[
          { ...realName, dataIndex: 'realName' },
          { ...phone, dataIndex: 'phone' },
          { ...username, dataIndex: 'username' },
          operation(history, 'id'),
        ]}
      />
    </div>
  );
}

const realName = {
  title: '姓名',
  align: 'center',
  dataIndex: ['user', 'realName'],
};

const phone = {
  title: '联系电话',
  align: 'center',
  dataIndex: ['user', 'phone'],
};

const username = {
  title: '账户名称',
  align: 'center',
  dataIndex: ['user', 'username'],
};

const operation = (history, dataIndex = ['user', 'id']) => ({
  title: '操作',
  dataIndex,
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
