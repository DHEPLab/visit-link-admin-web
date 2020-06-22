import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Select, Form, Button, Tabs, Radio, Input } from 'antd';

import { useBoolState } from '../utils';
import { Role } from '../constants/enums';
import { Required } from '../constants';
import { ModalForm, WithPage, ContentHeader, CardTabs, ZebraTable } from '../components/*';

const { TabPane } = Tabs;
export default function Users() {
  const history = useHistory();
  const [tab, setTab] = useState('chw');
  const [visible, openUser, closeUser] = useBoolState();

  // change tab to refresh table
  function refresh() {
    const origin = tab;
    setTab(Math.random());
    setTab(origin);
  }

  function handleCreateUser(value) {
    Axios.post('/admin/user', value).then(() => {
      refresh();
      closeUser();
    });
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

      <ModalForm
        title="创建新用户"
        visible={visible}
        onCancel={closeUser}
        onFinish={handleCreateUser}
        initialValues={{ role: 'ROLE_CHW' }}
      >
        <h3>用户信息</h3>
        <Form.Item label="权限" name="role" rules={Required}>
          <Radio.Group>
            {Object.keys(Role).map((key) => (
              <Radio key={key} value={key}>
                {Role[key]}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="真实姓名" name="realName" rules={Required}>
          <Input autoFocus />
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(old, curr) => old.role !== curr.role}>
          {({ getFieldValue }) => (
            <>
              {getFieldValue('role') === 'ROLE_CHW' && (
                <>
                  <Form.Item label="ID" name={['chw', 'identity']} rules={Required}>
                    <Input />
                  </Form.Item>
                  <Form.Item label="所在区域" name={['chw', 'tags']} rules={Required}>
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
        <Form.Item label="账户名称" name="username" rules={Required}>
          <Input />
        </Form.Item>
        <Form.Item label="账户密码" name="password" rules={[{ required: true, min: 6 }]}>
          <Input.Password />
        </Form.Item>
      </ModalForm>
    </>
  );
}

const PageCHW = WithPage(CHW, '/admin/user/chw', {}, false);
const PageSupervisor = WithPage(Supervisor, '/admin/user/supervisor', {}, false);
const PageAdmin = WithPage(Admin, '/admin/user/admin', {}, false);

function CHW({ tab, history, loadData, onChangeSearch, ...props }) {
  useEffect(() => {
    tab === 'chw' && loadData();
  }, [tab, loadData]);

  return (
    <div>
      <ChwBar>
        <Input
          className="master"
          onChange={(e) => onChangeSearch('search', e.target.value)}
          placeholder="请输入社区工作者姓名、ID或所在区域搜索"
        />
        <Button ghost type="primary">
          批量创建社区工作者
        </Button>
      </ChwBar>
      <ZebraTable
        {...props}
        className="clickable"
        rowKey={(record) => record.user.id}
        onRow={(record) => onRow(history, record.user.id)}
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
        {...props}
        className="clickable"
        rowKey={(record) => record.user.id}
        onRow={(record) => onRow(history, record.user.id)}
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
        {...props}
        rowKey="id"
        className="clickable"
        onRow={(record) => onRow(history, record.id)}
        columns={[
          { ...realName, dataIndex: 'realName' },
          { ...phone, dataIndex: 'phone' },
          { ...username, dataIndex: 'username' },
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

const onRow = (history, id) => {
  return {
    onClick: () => {
      history.push(`/users/${id}`);
    },
  };
};
