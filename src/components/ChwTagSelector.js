import React, { useState } from 'react';
import styled from 'styled-components';
import { Cascader } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import Pcas from '../constants/pcas-code.json';
import TagSelect from './TagSelect';

export default function ChwTagSelector({ onChange, ...props }) {
  // tmp cascader value
  const [value] = useState([]);

  function onChangeCascader(values) {
    // fill the village to the selector
    if (props?.value) {
      onChange(props.value.concat(values[3]));
    } else {
      onChange([values[3]]);
    }
  }

  return (
    <Container>
      <TagSelect onChange={onChange} {...props} />
      <CascaderContainer>
        <Cascader
          options={Pcas}
          value={value}
          onChange={onChangeCascader}
          fieldNames={{ label: 'name', value: 'name', children: 'children' }}
        >
          <PlusCircleOutlined style={{ color: '#ff794f', outline: 'none' }} />
        </Cascader>
      </CascaderContainer>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
`;

const CascaderContainer = styled.div`
  position: absolute;
  right: 34px;
  top: 8px;
`;
