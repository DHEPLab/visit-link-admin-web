import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Select, Form, Button, Modal, Tabs, Radio, Input, Space } from 'antd';

import { useBoolState } from '../utils';
import { WithPage, ContentHeader, CardTabs, ZebraTable } from '../components/*';
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
      <ContentHeader title="账户管理">
        <Button type="primary" onClick={openUser}>
          创建新用户
        </Button>
      </ContentHeader>
      <CardTabs onChange={setTab}>
        <TabPane tab="社区工作者" key="chw">
          <PageCHW tab={tab} history={history} />
        </TabPane>
        <TabPane tab="督导" key="supervisor">
          <PageSupervisor tab={tab} history={history} />
        </TabPane>
        <TabPane tab="管理员" key="admin">
          <PageAdmin tab={tab} history={history} />
        </TabPane>
      </CardTabs>

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

function CHW({ tab, history, loadData, ...props }) {
  useEffect(() => {
    tab === 'chw' && loadData();
  }, [tab, loadData]);

  return (
    <div>
      <ChwBar>
        <Input className="master" placeholder="请输入社区工作者姓名、ID或所在区域搜索" />
        <Button ghost type="primary">
          批量创建社区工作者
        </Button>
      </ChwBar>
      <ZebraTable
        rowKey={(record) => record.user.id}
        {...props}
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

const ChwBar = styled.div`
  height: 76px;
  padding-left: 30px;
  padding-right: 20px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ffc3a0;
`;

function Supervisor({ tab, history, loadData, ...props }) {
  useEffect(() => {
    tab === 'supervisor' && loadData();
  }, [tab, loadData]);

  return (
    <div>
      <ZebraTable
        rowKey={(record) => record.user.id}
        {...props}
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

function Admin({ tab, history, loadData, ...props }) {
  useEffect(() => {
    tab === 'admin' && loadData();
  }, [tab, loadData]);

  return (
    <div>
      <ZebraTable
        rowKey="id"
        {...props}
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
      <Button size="small" type="link" onClick={() => history.push(`/users/${id}`)}>
        查看
      </Button>
    );
  },
});
