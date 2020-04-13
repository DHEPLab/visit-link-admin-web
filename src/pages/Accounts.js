import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table } from 'antd';
import styled from 'styled-components';

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

  useEffect(() => {
    axios.get('/api/user').then((response) => {
      setUser(response.data);
    });
  }, []);

  return (
    <div>
      <h1>Account Management</h1>
      <ButtonGroup>
        <Button type="primary">Add a new account</Button>
      </ButtonGroup>
      <Table
        rowKey="id"
        dataSource={user.content}
        columns={columns}
        pagination={{ current: 1, total: user.totalElements }}
      />
    </div>
  );
}

const ButtonGroup = styled.div`
  padding: 10px 0;
  text-align: right;
`;
