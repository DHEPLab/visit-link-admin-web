import React from 'react';

import { Select } from 'antd';
import { useManualFetch } from '../utils';

export default function TagSelect(props) {
  const [options, refresh] = useManualFetch('/admin/tags', {}, []);

  return (
    <Select mode="tags" onFocus={() => refresh()} {...props}>
      {options.map((option) => (
        <Select.Option key={option.id} value={option.name}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
}
