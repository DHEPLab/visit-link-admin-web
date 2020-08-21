import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export default function SearchInput({ ...props }) {
  return (
    <Input
      allowClear
      className="master"
      suffix={<SearchOutlined style={{ color: '#FFC3A0' }} />}
      {...props}
    />
  );
}
