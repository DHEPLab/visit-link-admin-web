import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { Form, Modal, Button, Input, Space, Select } from 'antd';
import { useParams, useHistory } from 'react-router-dom';

import Rules from '../constants/rules';
import { useFetch, useBoolState } from '../utils';
import { Role, Gender } from '../constants/enums';
import {
  Card,
  ZebraTable,
  ModalForm,
  StaticField,
  DetailHeader,
  AssignModalTable,
  DeleteConfirmModal,
  TagSelect,
} from '../components/*';

export default function User() {
  const { id } = useParams();
  const history = useHistory();
  const [user, refresh] = useFetch(`/admin/users/${id}`);
  const [changePasswordVisible, openChangePassword, closeChangePassword] = useBoolState();
  const [changeProfileVisible, openChangeProfile, closeChangeProfile] = useBoolState();
  const [closeAccountVisible, openCloseAccount, closeCloseAccount] = useBoolState();

  const roleChw = () => user.role === 'ROLE_CHW';
  const roleSupervisor = () => user.role === 'ROLE_SUPERVISOR';

  function handleChangeProfile(values) {
    Axios.put(`/admin/users/${id}`, values).then(() => {
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

  function handleCloseAccount(data) {
    Axios.delete(`/admin/users/chw/${id}`, { data }).then(() => history.goBack());
  }

  return (
    <>
      <DetailHeader
        icon="iconuser-primary"
        menu="账户管理"
        title={user.realName}
        role={role()}
        extra={
          roleChw() && (
            <Button ghost type="danger" onClick={openCloseAccount}>
              注销账户
            </Button>
          )
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
      <CloseAccountModal
        id={id}
        visible={closeAccountVisible}
        onCancel={closeCloseAccount}
        onFinish={handleCloseAccount}
      />

      <ModalForm
        title="修改用户信息"
        initialValues={user}
        onFinish={handleChangeProfile}
        visible={changeProfileVisible}
        onCancel={closeChangeProfile}
      >
        <Form.Item label="真实姓名" name="realName" rules={Rules.RealName}>
          <Input />
        </Form.Item>
        <Form.Item label="联系电话" name="phone" rules={Rules.Phone}>
          <Input />
        </Form.Item>
        {roleChw() && (
          <Form.Item label="所在区域" name={['chw', 'tags']} rules={Rules.Area}>
            <TagSelect />
          </Form.Item>
        )}
      </ModalForm>
    </>
  );
}

function CloseAccountModal({ id, visible, onCancel, onFinish }) {
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    visible && form.resetFields();
  }, [visible, form]);

  const debounceSearch = debounce((search) => {
    Axios.get('/admin/users/chw', {
      params: {
        search,
        size: 10,
      },
    }).then((response) => setOptions(response.data.content));
  }, 400);

  return (
    <Modal
      title="注销用户"
      closable={false}
      destroyOnClose
      onCancel={onCancel}
      visible={visible}
      footer={
        <Space size="large">
          <Button ghost type="danger" onClick={onCancel}>
            再想想
          </Button>
          <Button type="danger" onClick={form.submit}>
            注销用户
          </Button>
        </Space>
      }
    >
      <p>
        移除社区工作者将使该社区工作者处于未分配状态，同时督导员无法对该社区工作者进行查看、修改信息和分配宝宝是否要继续？
      </p>
      <Form form={form} onFinish={onFinish} labelCol={{ span: 0 }}>
        <Form.Item label="社区工作者" name="userId" rules={Rules.Required}>
          <Select
            showSearch
            filterOption={false}
            onFocus={() => debounceSearch()}
            onSearch={debounceSearch}
            style={{ width: '100%' }}
            placeholder="请选择移交宝宝的社区工作者"
          >
            {options
              .filter((o) => o.user.id !== Number(id))
              .map((o) => (
                <Select.Option key={o.user.id}>
                  {o.user.realName}/{o.user.chw.identity}/{o.user.chw.tags.join(',')}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
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
    Axios.put(`/admin/users/${id}/password`, values).then(onCancel);
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
        <Form.Item label="新的账户密码" name="password" rules={Rules.Password}>
          <Input.Password style={{ width: '100%' }} placeholder="请输入新的账户密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function AssignBaby({ id }) {
  const history = useHistory();
  const [visible, openModal, closeModal] = useBoolState(false);
  const [dataSource, refresh] = useFetch(`/admin/users/chw/${id}/babies`, {}, []);

  // release chw, set chw's supervisor to null
  function handleRelease(babyId) {
    Axios.delete(`/admin/babies/${babyId}/chw`).then(() => refresh());
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
            width: 140,
            align: 'center',
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
                <DeleteConfirmModal
                  title="解绑宝宝"
                  content="解绑宝宝后，该宝宝将处于未分配状态，且不会出现在社区工作者 app 端宝宝列表中，该工作者也无法对宝宝进行家访。确定要继续吗？"
                  onConfirm={() => handleRelease(babyId)}
                  okText="解绑"
                >
                  <Button size="small" type="link">
                    解绑
                  </Button>
                </DeleteConfirmModal>
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
  const [dataSource, refresh] = useFetch(`/admin/users/chw/not_assigned/babies`, {}, []);

  useEffect(() => {
    if (visible) refresh();
    // eslint-disable-next-line
  }, [visible]);

  async function handleAssign(babyIds) {
    await Axios.post(`/admin/users/chw/${id}/babies`, babyIds);
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
  const [dataSource, refresh] = useFetch(`/admin/users/supervisor/${id}/chw`, {}, []);

  // release chw, set chw's supervisor to null
  function handleRelease(chwId) {
    Axios.delete(`/admin/users/chw/${chwId}/supervisor`).then(() => refresh());
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
            width: 180,
            align: 'center',
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
                <DeleteConfirmModal
                  title="解绑社区工作者"
                  content="确认要解绑此社区工作者？"
                  okText="解绑"
                  onConfirm={() => handleRelease(chwId)}
                >
                  <Button size="small" type="link">
                    解绑
                  </Button>
                </DeleteConfirmModal>
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
  const [dataSource, refresh] = useFetch(`/admin/users/supervisor/not_assigned/chw`, {}, []);

  useEffect(() => {
    if (visible) {
      refresh();
    }
    // eslint-disable-next-line
  }, [visible]);

  async function handleAssign(chwIds) {
    await Axios.post(`/admin/users/supervisor/${id}/chw`, chwIds);
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
