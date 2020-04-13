import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal } from 'antd';
import styled from 'styled-components';
import UserForm from '../components/UserForm';

const columns = [
  {
    title: 'Username',
    dataIndex: 'username',
  },
  {
    title: 'Name',
    dataIndex: 'realName',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
];

export default function () {
  const [user, setUser] = useState({});
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    axios.get('/api/user', { params: { page, size: 1 } }).then((response) => {
      setUser(response.data);
    });
  }, [page]);

  function handleSubmitUser() {
    setVisible(false)
  }

  return (
    <div>
      <h1>Account Management</h1>
      <ButtonGroup>
        <Button type="primary" onClick={() => setVisible(true)}>
          Add a new account
        </Button>
      </ButtonGroup>
      <Table
        rowKey="id"
        dataSource={user.content}
        columns={columns}
        pagination={{
          current: page + 1,
          pageSize: 1,
          total: user.totalElements,
        }}
        onChange={(page) => setPage(page.current - 1)}
      />

      <Modal
        title="Add new account"
        visible={visible}
        onOk={handleSubmitUser}
        onCancel={() => setVisible(false)}
      >
        <UserForm />
      </Modal>
    </div>
  );
}

const ButtonGroup = styled.div`
  padding: 10px 0;
  text-align: right;
`;
