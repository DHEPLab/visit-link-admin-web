import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Input, Space } from 'antd';
import { useParams } from 'react-router-dom';

import { Card, StaticFormItem } from '../components/*';
import { useFetch } from '../utils';
import { Role } from '../constants/enums';

export default function User() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);

  useEffect(() => {
    Axios.get(`/admin/user/${id}`).then(({ data }) => setUser(data));
  }, [id]);

  return (
    <>
      <h2>账户管理详情</h2>
      <Card title="用户信息" extra={<Button type="link">编辑资料</Button>}>
        <StaticFormItem label="真实姓名">{user.realName}</StaticFormItem>
        <StaticFormItem label="联系电话">{user.phone}</StaticFormItem>
        <StaticFormItem label="权限">{Role[user.role]}</StaticFormItem>
      </Card>
      <br />
      <Card
        title="账户信息"
        extra={
          <Button type="link" onClick={() => setChangePasswordModalVisible(true)}>
            修改密码
          </Button>
        }
      >
        <StaticFormItem label="账户名称">{user.username}</StaticFormItem>
        <StaticFormItem label="账户密码">******</StaticFormItem>
      </Card>
      <br />
      {user.role === 'ROLE_SUPERVISOR' && <AssignChw id={id} />}
      <ChangePasswordModal
        id={id}
        visible={changePasswordModalVisible}
        onCancel={() => setChangePasswordModalVisible(false)}
      />
    </>
  );
}

function ChangePasswordModal({ id, onCancel, ...props }) {
  const [password, setPassword] = useState();

  function handleSubmit() {
    Axios.put(`/admin/user/${id}/password`, {
      password,
    }).then(onCancel);
  }

  return (
    <Modal
      title="您确定要修改密码吗？"
      destroyOnClose
      onCancel={onCancel}
      footer={
        <Space>
          <Button ghost type="primary" onClick={onCancel}>
            放弃
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            确定
          </Button>
        </Space>
      }
      {...props}
    >
      <p>请您牢记最新修改的密码，提交后将不再显示；且修改后，用户原密码将不可用</p>
      <Input.Password
        placeholder="请输入新的账户密码"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
    </Modal>
  );
}

function AssignChw({ id }) {
  const [dataSource, load] = useFetch(`/admin/user/supervisor/${id}/chw`, {}, []);
  const [visible, setVisible] = useState(false);

  // release chw, the supervisor of chw is null
  function handleRelease(chwId) {
    Axios.delete(`/admin/user/chw/${chwId}/supervisor`).then(load);
  }

  return (
    <Card
      title="管理工作人员列表"
      extra={
        <Button type="link" onClick={() => setVisible(true)}>
          分配新工作人员
        </Button>
      }
    >
      <Table
        rowKey="id"
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: '工作人员姓名',
            dataIndex: 'realName',
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 200,
            align: 'center',
            render(chwId) {
              return (
                <Button type="link" onClick={() => handleRelease(chwId)}>
                  删除
                </Button>
              );
            },
          },
        ]}
      />
      <NotAssignedChw
        id={id}
        onChange={load}
        visible={visible}
        onCancel={() => setVisible(false)}
      />
    </Card>
  );
}

// open a new modal, assign chw to supervisor
function NotAssignedChw({ id, onChange, ...props }) {
  const [dataSource, load] = useFetch(`/admin/user/chw/not_assigned`, {}, []);

  // on modal visble, reload data
  useEffect(() => {
    props.visible && load();
  }, [props.visible]);

  function handleAssign(chwId) {
    Axios.post(`/admin/user/supervisor/${id}/chw`, [chwId]).then(() => {
      load();
      onChange();
    });
  }

  return (
    <Modal {...props} footer={null}>
      <Table
        rowKey="id"
        pagination={false}
        dataSource={dataSource}
        columns={[
          {
            title: '工作人员姓名',
            dataIndex: 'realName',
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 200,
            align: 'center',
            render(chwId) {
              return (
                <Button type="link" onClick={() => handleAssign(chwId)}>
                  分配
                </Button>
              );
            },
          },
        ]}
      />
    </Modal>
  );
}
