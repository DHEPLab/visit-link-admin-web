import { Input, InputProps } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import React from "react";

export type SearchInputProps = InputProps;

const SearchInput: React.FC<SearchInputProps> = ({ ...props }) => {
  return <Input allowClear className="master" suffix={<SearchOutlined style={{ color: "#FFC3A0" }} />} {...props} />;
};

export default SearchInput;
