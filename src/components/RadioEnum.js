import React from 'react';
import { Radio } from 'antd';

import * as Enums from '../constants/enums';

export default function RadioEnum({ name, ...props }) {
  return (
    <Radio.Group {...props}>
      {Object.keys(Enums[name] || []).map((key) => (
        <Radio key={key} value={key}>
          {Enums[name][key]}
        </Radio>
      ))}
    </Radio.Group>
  );
}
