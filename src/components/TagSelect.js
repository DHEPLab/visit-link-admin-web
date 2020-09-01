import React from 'react';
import Axios from 'axios';
import styled from 'styled-components';

import { Select, Button } from 'antd';
import { useManualFetch } from '../utils';

export default function TagSelect({ onChange, ...props }) {
  const [options, refresh] = useManualFetch('/admin/tags', {}, []);

  function handleDelete(option) {
    setTimeout(() => {
      // delete database tag
      Axios.delete(`/admin/tags/${option.id}`).then(() => refresh());
      // delete value from props.value
      onChange(props.value?.filter((v) => v !== option.name));
    }, 20);
    return false;
  }

  return (
    <Select
      mode="tags"
      onFocus={() => refresh()}
      optionLabelProp="name"
      onChange={onChange}
      {...props}
    >
      {options.map((option) => (
        <Select.Option key={option.id} value={option.name}>
          <Option>
            <label>{option.name}</label>
            {!props.value?.includes(option.name) && (
              <Button size="small" type="link" onClick={() => handleDelete(option)}>
                删除
              </Button>
            )}
          </Option>
        </Select.Option>
      ))}
    </Select>
  );
}

const Option = styled.div`
  display: flex;
  justify-content: space-between;

  label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
