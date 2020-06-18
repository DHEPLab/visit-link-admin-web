import Axios from 'axios';
import React, { useEffect } from 'react';
import { Form, Modal, Button, Table, Input, Space, Select } from 'antd';
import { useParams } from 'react-router-dom';

import StaticField from '../components/StaticField';
import { Card, ZebraTable } from '../components/*';
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
        <StaticField label="真实姓名">{user.realName}</StaticField>
        {user.role === 'ROLE_CHW' && (
          <>
            <StaticField label="ID">{user.chw.identity}</StaticField>
            <StaticField label="所在区域">{user.chw.tags && user.chw.tags.join(', ')}</StaticField>
          </>
        )}
        <StaticField label="联系电话">{user.phone}</StaticField>
        <StaticField label="权限">{Role[user.role]}</StaticField>
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
        <StaticField label="账户名称">{user.username}</StaticField>
        <StaticField label="账户密码">******</StaticField>
      </Card>
      <br />
      {user.role === 'ROLE_SUPERVISOR' && <AssignChw id={id} />}
      {user.role === 'ROLE_CHW' && <AssignBaby id={id} />}
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
  }, [props.visible, user, form]);

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
        {user.role === 'ROLE_CHW' && (
          <Form.Item label="所在区域" name={['chw', 'tags']} rules={[{ required: true }]}>
            <Select mode="tags" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

function ChangePasswordModal({ id, onCancel, ...props }) {
  const [form] = Form.useForm();
  useEffect(() => {
    props.visible && form.resetFields();
  }, [props, form]);

  function onFinish(values) {
    Axios.put(`/admin/user/${id}/password`, values).then(onCancel);
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
          <Button type="primary" onClick={form.submit}>
            确定
          </Button>
        </Space>
      }
      {...props}
    >
      <p>请您牢记最新修改的密码，提交后将不再显示；且修改后，用户原密码将不可用</p>
      <Form form={form} onFinish={onFinish} labelCol={{ span: 0 }}>
        <Form.Item label="新的账户密码" name="password" rules={[{ required: true, min: 6 }]}>
          <Input.Password placeholder="请输入新的账户密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function AssignBaby({ id }) {
  const [dataSource, load] = useFetch(`/admin/chw/${id}/baby`, {}, []);
  const [visible, openAssign, closeAssign] = useBoolState();

  // release chw, set chw's supervisor to null
  function handleRelease(babyId) {
    Axios.delete(`/admin/baby/${babyId}/chw`).then(load);
  }

  return (
    <Card
      title="负责宝宝列表"
      noPadding
      extra={
        <Button type="link" onClick={openAssign}>
          添加新宝宝
        </Button>
      }
    >
      <ZebraTable
        rowKey="id"
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: '宝宝姓名',
            dataIndex: 'name',
          },
          {
            title: 'ID',
            dataIndex: 'identity',
          },
          {
            title: '性别',
            dataIndex: 'gender',
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 200,
            align: 'center',
            render(babyId) {
              return (
                <Button size="small" type="link" onClick={() => handleRelease(babyId)}>
                  删除
                </Button>
              );
            },
          },
        ]}
      />
      <NotAssignedBabyModal id={id} onChange={load} visible={visible} onCancel={closeAssign} />
    </Card>
  );
}

// open a new modal, assign chw to supervisor
function NotAssignedBabyModal({ id, onChange, ...props }) {
  const [dataSource, load] = useFetch(`/admin/baby/not_assigned`, {}, []);

  // on modal visble, reload data
  useEffect(() => {
    props.visible && load();
  }, [props.visible, load]);

  function handleAssign(babyId) {
    Axios.post(`/admin/chw/${id}/baby`, [babyId]).then(() => {
      load();
      onChange();
    });
  }

  return (
    <Modal title="分配新宝宝" {...props} footer={null}>
      <Table
        rowKey="id"
        pagination={false}
        dataSource={dataSource}
        columns={[
          {
            title: '宝宝姓名',
            dataIndex: 'name',
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

function AssignChw({ id }) {
  const [dataSource, load] = useFetch(`/admin/user/supervisor/${id}/chw`, {}, []);
  const [visible, openAssign, closeAssign] = useBoolState();

  // release chw, set chw's supervisor to null
  function handleRelease(chwId) {
    Axios.delete(`/admin/user/chw/${chwId}/supervisor`).then(load);
  }

  return (
    <Card
      title="负责社区工作者列表"
      noPadding
      extra={
        <Button type="link" onClick={openAssign}>
          分配新人员
        </Button>
      }
    >
      <ZebraTable
        rowKey="id"
        dataSource={dataSource}
        pagination={false}
        columns={[
          {
            title: '社区工作者姓名',
            dataIndex: 'realName',
          },
          {
            title: 'ID',
            dataIndex: ['chw', 'identity'],
          },
          {
            title: '联系电话',
            dataIndex: 'phone',
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 200,
            align: 'center',
            render(chwId) {
              return (
                <Button size="small" type="link" onClick={() => handleRelease(chwId)}>
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
