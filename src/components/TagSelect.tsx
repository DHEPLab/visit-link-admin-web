import axios from "axios";
import styled from "styled-components";

import { Select, Button, SelectProps } from "antd";
import useFetch from "@/hooks/useFetch";
import { Tag } from "@/models/res/Tag";

export type TagSelectProps<ValueType = string[]> = SelectProps<ValueType> & {
  onChange?: (value?: string[]) => void;
};

const TagSelect = <ValueType extends string[]>({ onChange, ...props }: TagSelectProps<ValueType>) => {
  const [options, refresh] = useFetch<Tag[]>("/admin/tags", {}, [], true);

  function handleDelete(option: Tag) {
    setTimeout(() => {
      // delete database tag
      axios.delete(`/admin/tags/${option.id}`).then(() => refresh());
      // delete value from props.value
      onChange?.(props.value?.filter((v) => v !== option.name));
    }, 20);
    return false;
  }

  return (
    <Select mode="tags" onFocus={() => refresh()} optionLabelProp="name" onChange={onChange} {...props}>
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
};

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

export default TagSelect;
