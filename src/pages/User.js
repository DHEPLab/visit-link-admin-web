import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Modal, Button, Table, Input, Space } from 'antd';
import { useParams } from 'react-router-dom';

import { Card, StaticFormItem } from '../components/*';
import { useFetch, useBoolState } from '../utils';
import { Role } from '../constants/enums';

export default function User() {
  const { id } = useParams();
  const [user, load] = useFetch(`/admin/user/${id}`);
  const [changePasswordVisible, openChangePassword, closeChangePassword] = useBoolState();
  const [changeProfileVisible, openChangeProfile, closeChangeProfile] = useBoolState();

  return (
    <>
      <h2>账户管理详情</h2>
      <Card
        title="用户信息"
        extra={
          <Button type="link" onClick={openChangeProfile}>
            编辑资料
          </Button>
        }
      >
        <StaticFormItem label="真实姓名">{user.realName}</StaticFormItem>
        <StaticFormItem label="联系电话">{user.phone}</StaticFormItem>
        <StaticFormItem label="权限">{Role[user.role]}</StaticFormItem>
      </Card>
      <br />
      <Card
        title="账户信息"
        extra={
          <Button type="link" onClick={openChangePassword}>
            修改密码
          </Button>
        }
      >
        <StaticFormItem label="账户名称">{user.username}</StaticFormItem>
        <StaticFormItem label="账户密码">******</StaticFormItem>
      </Card>
      <br />
      {user.role === 'ROLE_SUPERVISOR' && <AssignChw id={id} />}
      <ChangePasswordModal id={id} visible={changePasswordVisible} onCancel={closeChangePassword} />
      <ChangeProfileModal
        user={user}
        visible={changeProfileVisible}
        onSuccess={() => {
          load();
          closeChangeProfile();
        }}
        onCancel={closeChangeProfile}
      />
    </>
  );
}

function ChangeProfileModal({ user, onSuccess, onCancel, ...props }) {
  const [form] = Form.useForm();

  useEffect(() => {
    props.visible && form.setFieldsValue(user);
  }, [props.visible, user]);

  function onFinish(values) {
    Axios.put(`/admin/user/${user.id}`, values).then(onSuccess);
  }

  return (
    <Modal
      destroyOnClose
      title="修改用户信息"
      footer={
        <Space>
          <Button ghost type="primary" onClick={onCancel}>
            放弃
          </Button>
          <Button type="primary" onClick={form.submit}>
            确定
          </Button>
        </Space>
      }
      {...props}
    >
      <Form form={form} wrapperCol={{ offset: 1 }} onFinish={onFinish}>
        <Form.Item label="真实姓名" name="realName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="联系电话" name="phone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
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
  const [visible, openAssign, closeAssign] = useBoolState();

  // release chw, set chw's supervisor to null
  function handleRelease(chwId) {
    Axios.delete(`/admin/user/chw/${chwId}/supervisor`).then(load);
  }

  return (
    <Card
      title="管理工作人员列表"
      extra={
        <Button type="link" onClick={openAssign}>
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
      <NotAssignedChwModal id={id} onChange={load} visible={visible} onCancel={closeAssign} />
    </Card>
  );
}

// open a new modal, assign chw to supervisor
function NotAssignedChwModal({ id, onChange, ...props }) {
  const [dataSource, load] = useFetch(`/admin/user/chw/not_assigned`, {}, []);

  // on modal visble, reload data
  useEffect(() => {
    props.visible && load();
  }, [props.visible, load]);

  function handleAssign(chwId) {
    Axios.post(`/admin/user/supervisor/${id}/chw`, [chwId]).then(() => {
      load();
      onChange();
    });
  }

  return (
    <Modal title="分配新工作人员" {...props} footer={null}>
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
