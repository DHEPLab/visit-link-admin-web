import React from "react";
import { Table } from "antd";

export default function ZebraTable({ ...props }) {
  return <Table rowClassName={(_, index) => (index % 2 === 0 ? "even-row" : "odd-row")} {...props} />;
}
