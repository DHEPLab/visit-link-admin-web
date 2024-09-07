import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Modal, Space, Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";

import SearchInput from "./SearchInput";
import { WithPageProps } from "@/components/WithPage";

type AssignModalTableProps<T> = {
  title: string;
  columns: TableProps<T>["columns"];
  visible: boolean;
  onCancel: () => void;
  onFinish: (selectedRowKeys: React.Key[]) => void;
  onChangeSearch: (field: string, value: string) => void;
  rowSelectionType: "checkbox" | "radio";
  refreshOnVisible?: boolean;
} & WithPageProps &
  TableProps<T>;

const AssignModalTable = <T,>({
  title,
  columns,
  visible,
  onCancel,
  onFinish,
  onChangeSearch,
  rowSelectionType,
  refreshOnVisible,
  ...props
}: AssignModalTableProps<T>) => {
  const { t } = useTranslation(["common"]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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
      open={visible}
      style={{ top: 20 }}
      width={600}
      footer={
        <Space size="large" style={{ marginTop: "30px" }}>
          <Button ghost type="primary" size="large" onClick={onCancel}>
            {t("cancel")}
          </Button>
          <Button type="primary" size="large" onClick={() => onFinish(selectedRowKeys)}>
            {t("add")}
          </Button>
        </Space>
      }
      closable={false}
      maskClosable={false}
      styles={{ body: { padding: 0 } }}
      destroyOnClose
    >
      <SearchBar>
        <SearchInput
          style={{ width: "100%" }}
          onChange={(e) => onChangeSearch("search", e.target.value)}
          placeholder={t("searchInputByNameIDAreaPlaceholder")}
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
};

const SearchBar = styled.div`
  padding: 30px 20px 10px;
`;

export default AssignModalTable;
