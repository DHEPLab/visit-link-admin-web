import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Modal, Space, Button, Table } from "antd";

import SearchInput from "./SearchInput";

export default function AssignModalTable({
  title,
  columns,
  visible,
  onCancel,
  onFinish,
  onChangeSearch,
  rowSelectionType,
  refreshOnVisible,
  ...props
}) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    if (visible) {
      setSelectedRowKeys([]);
      if (refreshOnVisible) onChangeSearch("search", "");
    }
    // eslint-disable-next-line
  }, [visible]);

  return (
    <Modal
      title={title}
      visible={visible}
      style={{ top: 20 }}
      width={600}
      footer={
        <Space size="large" style={{ marginTop: "30px" }}>
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
        <SearchInput
          style={{ width: "100%" }}
          onChange={(e) => onChangeSearch("search", e.target.value)}
          placeholder="请输入姓名、ID或所在区域搜索"
        />
      </SearchBar>

      <Table
        rowKey="id"
        className="small"
        rowSelection={{
          type: rowSelectionType,
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        columns={columns}
        {...props}
      />
    </Modal>
  );
}

const SearchBar = styled.div`
  padding: 30px 20px;
  padding-bottom: 10px;
`;
