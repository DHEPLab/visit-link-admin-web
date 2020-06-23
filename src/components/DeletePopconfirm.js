import React from 'react';
import { Popconfirm } from 'antd';

export default function ({ children, ...props }) {
  return (
    <Popconfirm title="你确定？" okText="是" cancelText="否" {...props}>
      {children}
    </Popconfirm>
  );
}
