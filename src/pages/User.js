import Axios from 'axios';
import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { Form, Modal, Button, Input, Space, Select } from 'antd';
import { useParams, useHistory } from 'react-router-dom';

import { Required } from '../constants';
import { useFetch, useBoolState } from '../utils';
import { Role, Gender } from '../constants/enums';
import {
  Card,
  ZebraTable,
  ModalForm,
  StaticField,
  DetailHeader,
  AssignModalTable,
  DeletePopconfirm,
} from '../components/*';

export default function User() {
  const { id } = useParams();
  const [user, refresh] = useFetch(`/admin/user/${id}`);
  const [changePasswordVisible, openChangePassword, closeChangePassword] = useBoolState();
  const [changeProfileVisible, openChangeProfile, closeChangeProfile] = useBoolState();

  const roleChw = () => user.role === 'ROLE_CHW';
  const roleSupervisor = () => user.role === 'ROLE_SUPERVISOR';

  function handleChangeProfile(values) {
    Axios.put(`/admin/user/${id}`, values).then(() => {
      refresh();
      closeChangeProfile();
    });
  }

  function role() {
    if (roleChw()) {
      return `${Role[user.role]}ID ${user.chw.identity}`;
    }
    return Role[user.role];
  }

  return (
    <>
      <DetailHeader
        menu="账户管理"
        title={user.realName}
        role={role()}
        extra={
          <Button ghost type="danger">
            注销账户
          </Button>
        }
      />
      <Card
        title="用户信息"
        extra={
          <Button type="shade" onClick={openChangeProfile}>
            编辑资料
          </Button>
        }
      >
        <StaticField label="真实姓名">{user.realName}</StaticField>
        <StaticField label="联系电话">{user.phone}</StaticField>
        {roleChw() && (
          <StaticField label="所在区域">{user.chw.tags && user.chw.tags.join(', ')}</StaticField>
        )}
      </Card>
      <Card
        title="账户信息"
        extra={
          <Button type="shade" onClick={openChangePassword}>
            修改密码
          </Button>
        }
      >
        <StaticField label="账户名称">{user.username}</StaticField>
        <StaticField label="账户密码">******</StaticField>
      </Card>

      {roleSupervisor() && <AssignChw id={id} />}
      {roleChw() && <AssignBaby id={id} />}

      <ChangePasswordModal id={id} visible={changePasswordVisible} onCancel={closeChangePassword} />

      <ModalForm
        title="修改用户信息"
        initialValues={user}
        onFinish={handleChangeProfile}
        visible={changeProfileVisible}
        onCancel={closeChangeProfile}
      >
        <Form.Item label="真实姓名" name="realName" rules={Required}>
          <Input />
        </Form.Item>
        <Form.Item label="联系电话" name="phone" rules={Required}>
          <Input />
        </Form.Item>
        {roleChw() && (
          <Form.Item label="所在区域" name={['chw', 'tags']} rules={Required}>
            <Select mode="tags" />
          </Form.Item>
        )}
      </ModalForm>
    </>
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
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      footer={
        <Space size="large">
          <Button ghost type="danger" onClick={onCancel}>
            放弃
          </Button>
          <Button type="danger" onClick={form.submit}>
            确定
          </Button>
        </Space>
      }
      {...props}
    >
      <p>请您牢记最新修改的密码，提交后将不再显示；且修改后，用户原密码将不可用</p>
      <Form form={form} onFinish={onFinish} labelCol={{ span: 0 }}>
        <Form.Item label="新的账户密码" name="password" rules={[{ required: true, min: 6 }]}>
          <Input.Password style={{ width: '100%' }} placeholder="请输入新的账户密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function AssignBaby({ id }) {
  const history = useHistory();
  const [visible, openModal, closeModal] = useBoolState(false);
  const [dataSource, refresh] = useFetch(`/admin/chw/${id}/baby`, {}, []);

  // release chw, set chw's supervisor to null
  function handleRelease(babyId) {
    Axios.delete(`/admin/baby/${babyId}/chw`).then(refresh);
  }

  return (
    <Card
      title="负责宝宝列表"
      noPadding
      extra={
        <Button type="shade" onClick={openModal}>
          添加新宝宝
        </Button>
      }
    >
      <ZebraTable
        rowKey="id"
        className="clickable"
        onRow={(record) => ({
          onClick: (event) => {
            // do noting when click other target
            if (event.target.tagName === 'TD') {
              history.push(`/babies/${record.id}`);
            }
          },
        })}
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
            render: (h) => Gender[h],
          },
          {
            title: '主看护人',
            dataIndex: 'masterCarerName',
          },
          {
            title: '联系方式',
            dataIndex: 'masterCarerPhone',
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 200,
            align: 'center',
            render(babyId) {
              return (
                <DeletePopconfirm onConfirm={() => handleRelease(babyId)}>
                  <Button size="small" type="link">
                    删除
                  </Button>
                </DeletePopconfirm>
              );
            },
          },
        ]}
      />
      <NotAssignedBabyModal id={id} onFinish={refresh} visible={visible} onCancel={closeModal} />
    </Card>
  );
}

// open a new modal, assign chw to supervisor
function NotAssignedBabyModal({ id, onFinish, onCancel, visible }) {
  const [dataSource, refresh] = useFetch(`/admin/baby/not_assigned`, {}, []);

  useEffect(() => {
    if (visible) refresh();
    // eslint-disable-next-line
  }, [visible]);

  async function handleAssign(babyIds) {
    await Axios.post(`/admin/chw/${id}/baby`, babyIds);
    refresh();
    onFinish();
    onCancel();
  }

  const debounceRefresh = debounce((search) => refresh({ search }), 400);

  return (
    <AssignModalTable
      title="分配新宝宝"
      visible={visible}
      onChangeSearch={(e) => debounceRefresh(e.target.value)}
      onCancel={onCancel}
      dataSource={dataSource}
      onFinish={handleAssign}
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
          title: '所在区域',
          dataIndex: 'area',
        },
      ]}
    />
  );
}

function AssignChw({ id }) {
  const [visible, openModal, closeModal] = useBoolState();
  const [dataSource, refresh] = useFetch(`/admin/user/supervisor/${id}/chw`, {}, []);

  // release chw, set chw's supervisor to null
  function handleRelease(chwId) {
    Axios.delete(`/admin/user/chw/${chwId}/supervisor`).then(refresh);
  }

  return (
    <Card
      title="负责社区工作者列表"
      noPadding
      extra={
        <Button type="shade" onClick={openModal}>
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
            title: '所在区域',
            dataIndex: ['chw', 'tags'],
            render: (tags) => tags && tags.join(', '),
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
                <DeletePopconfirm onConfirm={() => handleRelease(chwId)}>
                  <Button size="small" type="link">
                    删除
                  </Button>
                </DeletePopconfirm>
              );
            },
          },
        ]}
      />
      <NotAssignedChwModal id={id} onFinish={refresh} visible={visible} onCancel={closeModal} />
    </Card>
  );
}

// open a new modal, assign chw to supervisor
function NotAssignedChwModal({ id, visible, onCancel, onFinish }) {
  const [dataSource, refresh] = useFetch(`/admin/user/chw/not_assigned`, {}, []);

  useEffect(() => {
    if (visible) {
      refresh();
    }
    // eslint-disable-next-line
  }, [visible]);

  async function handleAssign(chwIds) {
    await Axios.post(`/admin/user/supervisor/${id}/chw`, chwIds);
    refresh();
    onFinish();
    onCancel();
  }

  const debounceRefresh = debounce((search) => refresh({ search }), 400);

  return (
    <AssignModalTable
      visible={visible}
      onCancel={onCancel}
      onFinish={handleAssign}
      dataSource={dataSource}
      title="分配新社区工作者"
      onChangeSearch={(e) => debounceRefresh(e.target.value)}
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
          title: '所在区域',
          dataIndex: ['chw', 'tags'],
          render: (tags) => tags && tags.join(', '),
        },
      ]}
    />
  );
}
