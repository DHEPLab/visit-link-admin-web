import React from 'react';
import { Select } from 'antd';

import * as Enums from '../constants/enums';

export default function ({ name, ...props }) {
  return (
    <Select {...props}>
      {Object.keys(Enums[name] || []).map((key) => (
        <Select.Option key={key} value={key}>
          {Enums[name][key]}
        </Select.Option>
      ))}
    </Select>
  );
}
