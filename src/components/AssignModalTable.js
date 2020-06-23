import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Modal, Space, Button, Input, Table } from 'antd';

export default function ({ title, dataSource, columns, visible, onCancel, onFinish }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    if (visible) {
      setSelectedRowKeys([]);
    }
  }, [visible]);

  return (
    <Modal
      title={title}
      visible={visible}
      width={600}
      footer={
        <Space size="large" style={{ marginTop: '30px' }}>
          <Button ghost type="primary" size="large" onClick={onCancel}>
            放弃
          </Button>
          <Button type="primary" size="large" onClick={() => onFinish(selectedRowKeys)}>
            添加
          </Button>
        </Space>
      }
      closable={false}
      maskClosable={false}
      bodyStyle={{ padding: 0 }}
      destroyOnClose
    >
      <SearchBar>
        <Input
          style={{ width: '100%' }}
          className="master"
          placeholder="请输入宝宝姓名、ID或所在区域搜索"
        />
      </SearchBar>

      <Table
        rowKey="id"
        className="small"
        pagination={false}
        dataSource={dataSource}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        columns={columns}
      />
    </Modal>
  );
}

const SearchBar = styled.div`
  padding: 30px 20px;
  padding-bottom: 10px;
`;
